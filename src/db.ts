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
function getDB(): Promise<IDBDatabase> {
  let resolve: (db: IDBDatabase) => any,
    reject: (err: Event) => any,
    promise = new Promise<IDBDatabase>((r, j) => {
      resolve = r
      reject = j
    })

  // Ensure the object store exists
  const dbreq = indexedDB.open(DB_NAME, DB_VERSION)
  dbreq.onupgradeneeded = ev => {
    const db = dbreq.result
    const store = db.createObjectStore(DB_OBJ_STORE, { keyPath: "id" })
    store.createIndex("firstname", "firstname", { unique: false })
    store.createIndex("lastname", "lastname", { unique: false })
  }
  dbreq.onsuccess = () => resolve(dbreq.result)
  dbreq.onerror = ev => reject(ev)
  return promise
}

/**
 * Fetches the current contact list from the API, in the
 * format they use.
 */
function fetchAPIPersons(): Promise<APIPerson[]> {
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
function putPersonInStore(
  store: IDBObjectStore,
  person: APIPerson
): Promise<void> {
  let resolve: () => any,
    reject: (ev: Event) => any,
    promise = new Promise<void>((r, j) => {
      resolve = r
      reject = j
    })
  const op = store.put(mapAPItoDBPerson(person))
  op.onsuccess = () => resolve()
  op.onerror = ev => reject(ev)
  return promise
}

/**
 * Do the full db sync
 */
async function syncDB() {
  if (
    Date.now() <
    +(localStorage.getItem(LS_LAST_SYNC_KEY) || 0) + TEN_MINUTES_MS
  )
    return
  console.debug("BEGINNING SYNC")
  let [db, apiPersons] = await Promise.all([getDB(), fetchAPIPersons()])
  const store = db
    .transaction(DB_OBJ_STORE, "readwrite")
    .objectStore(DB_OBJ_STORE)
  await Promise.all(apiPersons.map(person => putPersonInStore(store, person)))
  localStorage.setItem(LS_LAST_SYNC_KEY, "" + Date.now())
  console.debug("SYNC COMPLETE")
}

export type SearchResult = Pick<
  Person,
  "firstname" | "lastname" | "thumbnail" | "id"
>

async function searchNameIndex(
  indexName: "firstname" | "lastname",
  search: string
): Promise<Record<string, SearchResult>> {
  return new Promise(async (resolve, reject) => {
    const results: Record<string, SearchResult> = {}
    try {
      const db = await getDB()
      const store = db.transaction(DB_OBJ_STORE).objectStore(DB_OBJ_STORE)
      const index = store.index(indexName)
      const cursorRequest = index.openCursor(
        IDBKeyRange.bound(search, search + "\uFFFF", false, false)
      )
      cursorRequest.onsuccess = () => {
        const cursor = cursorRequest.result
        if (!cursor) resolve(results)
        else {
          results[cursor.value.id] = {
            firstname: cursor.value.firstname,
            lastname: cursor.value.lastname,
            thumbnail: cursor.value.thumbnail,
            id: cursor.value.id,
          }
          cursor.continue()
        }
      }
    } catch (e) {
      reject(e)
    }
  })
}

export async function searchNames(search: string) {
  const results = {
    ...(await searchNameIndex("firstname", search)),
    ...(await searchNameIndex("lastname", search)),
  }
  return Object.entries(results)
    .map(([k, v]) => v)
    .sort((l, r) => {
      const ln = l.firstname + l.lastname
      const rn = r.firstname + r.lastname
      return ln < rn ? -1 : ln > rn ? 1 : 0
    })
}

// Start an interval to sync every ten minutes, also check right await
// on page load wether to sync
setInterval(() => {
  syncDB()
}, TEN_MINUTES_MS)
syncDB()
