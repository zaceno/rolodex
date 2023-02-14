# Plan

- [x] Fetch and map users to our own format in indexeddb
- [x] Regular syncing of db
- [x] Indexing on names/emails for efficient search
- [ ] Render initial list
- [ ] Rough search experimentation
- [ ] Rough detail page navigation
- [ ] DB Error handling and compatibility checking for opening db
- [ ] Event bus when api/db sync is ongoing, and error status
- [ ] Initial design for mobile
- [ ] Improve design for ipad
- [ ] Improve design for desktop
- [ ] Improve detail page navigation & design for mobile
- [ ] Improve detail page navigation & design for ipad
- [ ] Detail page navigation & design for desktop
- [ ] Search component with debouncing, spinner et c
- [ ] Infinite scroll or pagination?
- [ ] Sorting component
- [ ] Lighthouse testing

# Log

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
