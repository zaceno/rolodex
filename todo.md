# Plan

## Todo:

- [x] Fetch and map users to our own format in indexeddb
- [x] Regular syncing of db
- [x] Indexing on names/emails for efficient search
- [x] Implement searching "backend" functionality
- [x] Experiment with reasonable max results for search and sort
- [x] Render initial list
- [x] Rough search experimentation
- [x] Fix search to work for complete first/last name searches
- [x] Capitalize and clean up search term
- [x] Debounce search
- [x] Rough detail page navigation
- [x] Preserve search-term when navigating
- [x] DB Error handling and compatibility checking for opening db
- [x] Enable sorting on last-name/ascending/descending
- [x] Componentize & Design result list
- [ ] Prevent searching with empty string
- [ ] Search box & header
- [ ] Display for empty results
- [ ] Display errors
- [ ] DIsplay no search string
- [ ] Display busy searching
- [ ] Sorting selector
- [ ] improve navigation transitions
- [ ] Improve design for ipad
- [ ] Improve design for desktop
- [ ] Add comments to support reviewers

## Maybe:

- [ ] Event bus when api/db sync is ongoing, and error status display
- [ ] Enable searching for first and last name (depending on sort)
- [ ] Spinner in search component
- [ ] Lighthouse testing
- [ ] Redo logic in search view to use state-machine engine like hyperapp's

# Log

Started designing the result list for mobile first. Componentized some ofit
Realized that we will probably need to prevent searching on empty string. Require
at least one character for search.

---

After adding the sorting functionality and realizing what a mess the logic
was turning in to, I decided to clean it up with useReducer. It's a lot
more clear and structured now, but I'm not comforatable with how effects
are handled after render, and based on state properties that simply say
which effects should be run. Probably would like to clean it up even more
with a hyperapp-like state-machine like engine. But I'll put that off till
later if I feel I have more time.

---

I will (fully expectedly) need to elevate the state from both search and sort to the top of the search view. While doing that I used some new React18 features (useTransition, useDeferredValue) to make the input more responsive.

---

Spent a looong time digging in to what I thought might be a safari bug related
to indexeddb. Turns out, I just forgot the `[]` in the `useEffect` on the details
page, so I was looping through transactions on the DB and locking it 🤦‍♂️

---

Looking in to error handling, I might have to have a status-bar place to show
both syncing status and error messages in case there are errors.

---

Seems like search term is cached anyway on button navigation,
still, I decided to keep the last search term in localstorage so that
it would be kept even on reload of page.

---

Search debounce and clean up search term. Realized that when navigating back and forward
it is probably best to keep the last search term in localstorage (onunload), and
read it from there on page load. Will be a thing to solve after detail navigation

---

Missing out on full name search results was due to misunderstaning the IDBKeyRange.bound parameters. Fixed

---

Implemented very basic search functionality and noticed some issues
1 - Searching for a name that literally exists results in nothing. Figure that out
2 - Slows down a lot when searching for too few characters. Debounce it and limit results.
3 - search component should capitalize initial letter.

---

The plan to add "zzz" to the search term for bounding the names misses a lot of non-latin characters, so instead I add the maximum unicode codepoint \\uFFFF and that seems to do the trick. No maximum appears necessary at this point

---

Rather than stepping through all the contents of the indexdb and matching multiple fields
on a search string, an effective approach to searching seems to be to use the search term
as an lower bound, and searchterm+"zzz" as upper bound, and collecting all results
between those bounds for both firstname and lastname indexes. We can apply a reasonable maximum number of results as well, but for any reasonable length term of say three characters, there shouldn't be more than 100 results all in all which should be ok.
I'll implement a firstname + lastname ascending sorting as default for now.

---

Indexed db is set up and fetches. Will want to add error handling later, as well as an event bus for showing information in the UI when there is syncing. But first I want to
just do some rough experimentation with searching/listing, now that I have the data.

---

Begain exploring the API and realized they throttle access. Decided I'd need to make sure user-db is synced locally. Will use indexeddb in order to index on name and email fields for efficient searching. It is supported on all relevant browsers.

---

Started using create-react-app with typescript template. Of the popular
frameworks I'm most familiar with react. I also would like to show off
familiarity with typescript. Create-react-app is just an easy way to get
going. Cleaned out instrumentation, default icons and other stuff I don't
expect to need.
