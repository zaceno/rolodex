/*
-------------------------------------------------------------

The purpose of this module is to maintain a local database
of contacts, synced from the API, and mapped to local format,
in order to be able to search and sort the contacts without
going over the request-throttling-threshold of the API.

We sync local DB with the API at most once every 10 minutes. 


-------------------------------------------------------------
*/

const DB_NAME = "zach-rolodex"
const DB_VERSION = 1
const DB_OBJ_STORE = "people"
const API_URL = "https://randomuser.me/api/"
const API_NRESULTS = 5000
const API_SEED = "zach"
const LS_LAST_SYNC_KEY = "zach-rolodex-last-sync"
const TEN_MINUTES_MS = 1000 * 60 * 10

export enum SortMode {
  FLASC = 1,
  FLDSC = 2,
  LFASC = 3,
  LFDSC = 4,
}

// Person such as the API provides them, in order to perform type-safe mapping
type APIPerson = {
  name: { first: string; last: string; title: string }
  login: { uuid: string }
  location: {
    street: {
      number: number
      name: string
    }
    postcode: number
    city: string
    country: string
  }
  email: string
  phone: string
  cell: string
  picture: {
    large: string
    thumbnail: string
  }
}

// Person such as we store in local database
export type Person = {
  id: string
  firstname: string
  lastname: string
  title: string
  phone1: string
  phone2: string
  address1: string
  address2: string
  address3: string
  email: string
  thumbnail: string
  portrait: string
}

/**
 * Return a handle to the IndexedDB, while making sure the
 * object store exists.
 */
function getDB() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    // Ensure the object store exists
    if (!window.indexedDB) {
      return reject(new Error("IndexedDB not supported in this browser"))
    }
    const dbreq = indexedDB.open(DB_NAME, DB_VERSION)
    dbreq.onupgradeneeded = ev => {
      const db = dbreq.result
      const store = db.createObjectStore(DB_OBJ_STORE, { keyPath: "id" })
      store.createIndex("firstname", "firstname", { unique: false })
      store.createIndex("lastname", "lastname", { unique: false })
    }
    dbreq.onsuccess = () => resolve(dbreq.result)
    dbreq.onerror = ev => reject(ev)
  })
}

/**
 * Fetches the current contact list from the API, in the
 * format they use.
 */
async function fetchAPIPersons() {
  return fetch(`${API_URL}?results=${API_NRESULTS}&seed=${API_SEED}`)
    .then(x => x.json())
    .then(x => x.results as APIPerson[])
}

/**
 * Transform a contact in the API format to a
 * person on the format used in the local DB.
 */
function mapAPItoDBPerson(person: APIPerson): Person {
  return {
    id: person.login.uuid,
    firstname: person.name.first,
    lastname: person.name.last,
    title: person.name.title,
    email: person.email,
    address1: `${person.location.street.name} ${person.location.street.number}`,
    address2: `${person.location.postcode} ${person.location.city}`,
    address3: person.location.country,
    phone1: person.phone || person.cell,
    phone2: !!person.phone ? person.cell : "",
    thumbnail: person.picture?.thumbnail ?? "",
    portrait: person.picture?.large ?? "",
  }
}

/**
 * Save person in store. Return promise that
 * resolves on success and rejects on error
 */
function putPersonInStore(store: IDBObjectStore, person: APIPerson) {
  return new Promise<void>((resolve, reject) => {
    const op = store.put(mapAPItoDBPerson(person))
    op.onsuccess = ev => {
      resolve()
    }
    op.onerror = ev => {
      console.log(ev)
      reject(ev)
    }
  })
}

/**
 * Do the full db sync
 */
async function syncDB() {
  //If last sync was less than ten minutes ago, just skip
  if (
    Date.now() <
    +(localStorage.getItem(LS_LAST_SYNC_KEY) || 0) + TEN_MINUTES_MS
  )
    return
  //Remember last sync so we don't redo it too soon
  localStorage.setItem(LS_LAST_SYNC_KEY, "" + Date.now())

  console.debug("BEGINNING SYNC")

  //Get the Database
  const apiPersons = await fetchAPIPersons()
  const db = await getDB()
  const transaction = db.transaction([DB_OBJ_STORE], "readwrite")
  transaction.oncomplete = () => {
    console.log("SYNC COMPLETE")
  }
  transaction.onerror = e => {
    throw e
  }
  const store = transaction.objectStore(DB_OBJ_STORE)
  await Promise.all(apiPersons.map(person => putPersonInStore(store, person)))
}

/**
 * Start syncing
 */
;(() => {
  setInterval(() => {
    syncDB().catch(e => console.error(e.message))
  }, TEN_MINUTES_MS)
  syncDB().catch(e => console.error(e.message))
})()

// Type of item in list returned from searching
export type SearchResult = Pick<
  Person,
  "firstname" | "lastname" | "thumbnail" | "id" | "phone1" | "email"
>

/**
 * Searches the db along either firstname or lastname indexes
 * to find people who match
 */
async function searchNameIndex(
  indexName: "firstname" | "lastname",
  search: string
) {
  return new Promise<Record<string, SearchResult>>(async (resolve, reject) => {
    const results: Record<string, SearchResult> = {}
    const db = await getDB()
    const transaction = db.transaction([DB_OBJ_STORE], "readonly")
    const cursorRequest = transaction
      .objectStore(DB_OBJ_STORE)
      .index(indexName)
      .openCursor(IDBKeyRange.bound(search, search + "\uFFFF", false, false))
    cursorRequest.onsuccess = ev => {
      const cursor = cursorRequest.result
      // when cursor is null it means the iterations are
      // done and we can resolve the results
      if (!cursor) {
        resolve(results)
      } else {
        results[cursor.value.id] = {
          firstname: cursor.value.firstname,
          lastname: cursor.value.lastname,
          thumbnail: cursor.value.thumbnail,
          email: cursor.value.email,
          phone1: cursor.value.phone1,
          id: cursor.value.id,
        }
        cursor.continue()
      }
    }
    cursorRequest.onerror = e => {
      reject(e)
    }
  })
}

const fnln = (n: SearchResult) => n.firstname + n.lastname
const lnfn = (n: SearchResult) => n.lastname + n.firstname
const asc = (l: string, r: string) => (l < r ? -1 : l > r ? 1 : 0)
const desc = (l: string, r: string) => asc(r, l)
const sorters = {
  [SortMode.FLASC]: (l: SearchResult, r: SearchResult) => asc(fnln(l), fnln(r)),
  [SortMode.FLDSC]: (l: SearchResult, r: SearchResult) =>
    desc(fnln(l), fnln(r)),
  [SortMode.LFASC]: (l: SearchResult, r: SearchResult) => asc(lnfn(l), lnfn(r)),
  [SortMode.LFDSC]: (l: SearchResult, r: SearchResult) =>
    desc(lnfn(l), lnfn(r)),
}
/**
 * Combines search results from both firstname and
 * lastname searches, and sorts results
 */
export async function searchNames(search: string, sortMode: SortMode) {
  search = search.charAt(0).toUpperCase() + search.slice(1).toLowerCase()
  let results = Object.entries({
    ...(await searchNameIndex("firstname", search)),
    ...(await searchNameIndex("lastname", search)),
  })
    .map(([k, v]) => v)
    .sort(sorters[sortMode])
  return results
}

/**
 * Gets a single record from the database
 */
export async function getDetails(id: string) {
  return new Promise<Person>(async (resolve, reject) => {
    const db = await getDB()
    const transaction = db.transaction([DB_OBJ_STORE], "readonly")
    const req = transaction.objectStore(DB_OBJ_STORE).get(id)
    req.onsuccess = () => {
      if (!req.result) reject(new Error("Not found"))
      resolve(req.result)
    }
    req.onerror = ev => {
      reject(ev)
    }
  })
}
