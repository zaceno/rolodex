# ACME Inc. Rolodex

A contact-database frontend based on the http://randomuser.me api. An assignment for technical evaluation.

## How to test it

Clone the project to a local folder

```sh
cd rolodex
npm install
npm start
```

...then visit `http://localhost:3000` in your browser of choice (tested on latest chrome, firefox & safari)

## Notes for reviewers

Tried to leave helpful comments in the code where it seemed to make sense. I also left the "todo.md" file
which has a reverse-chronological-order log of my notes as I worked. That might also yield some insights
into my design choices and thinking process.

## What I'd do if this were a real assignment

This was a rather open-ended and broad assignment, so unfortunately there are some things I would like
to have done but skipped in the interest of time. My approach was to try to get this to the level of
a first working prototype demo for a client. A useful basis for further discussion.

If I had more time I would have liked to have added smooth transitions, and maybe rethink the idea of separate list/detail pages entirely. I would also have liked to have added some tests. Not unit-tests byt
automated whole-system-tests with e.g. cypress. But even before that, I would like to have maybe rethought some of my design-choices and done some heavy refactoring. Creating more reusable structures for future development.

And of course in a real-world scenario I would have liked to have done user-research, and worked with
a UX specialist to come up with a better design.
