# Plan

- [x] Fetch and map users to our own format in indexeddb
- [x] Regular syncing of db
- [x] Indexing on names/emails for efficient search
- [x] Implement searching "backend" functionality
- [x] Experiment with reasonable max results for search and sort
- [x] Render initial list
- [x] Rough search experimentation
- [x] Fix search to work for complete first/last name searches
- [ ] Capitalize and clean up search term
- [ ] Rough detail page navigation
- [ ] Enable sorting on last-name/ascending/descending
- [ ] DB Error handling and compatibility checking for opening db
- [ ] Event bus when api/db sync is ongoing, and error status
- [ ] Initial design for mobile
- [ ] Improve design for ipad
- [ ] Improve design for desktop
- [ ] Improve detail page navigation & design for mobile
- [ ] Improve detail page navigation & design for ipad
- [ ] Detail page navigation & design for desktop
- [ ] Spinner in search component
- [ ] Sorting component
- [ ] Lighthouse testing

# Log

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
