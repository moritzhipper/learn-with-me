# ToDo

# now

- use effect to set heights of elements:
- check textarea size on input, if scroll, make bigger. sync with translation textarea size.
- when no input text, set size of. translation to zero, remove the angular anims
- on new key press: all cards delete! then
- somehow flicker in proposed cards
- erst karten auf view, wenn beide services finishen
- streaming for fast translation
- filter doppelresponses aus preview
- selektiere zom importieren / importiere alle bubbles oder button
- move all ai stuff to translate tab
- do like full preview under main translate thing
- use two ai calls: one fast translate, separately the other two card calls that already exist
- add stagger vm mapping for lists
- move ai stuff to translate page
- tokenuse digram in stats

# Infra

- document setup
- configure automatic updates on ubuntu
- deploy
- finish github CD Action
- add outbound and inbound firewall for server
- add rate limiting using nginx
- add apply migration script
- use health check for deployment on backend -> shell script in github action
- use interactie drizzle command so all questions are answered in migration
- remove pino pretty from prod built -> update cjs, remove the pino pretty stuff

## Right Now

- write tests for store
  - import
  - merge
  - practice\

  season 2 episode 7

only put hat on big larry, remove from logo

- show always on bank preview
  - languages
  - base + dialect
- fix download preview view form
  - return only overview for most bank endpoints
  - return full bank for download endpoint, increase download count

# write tests

- create two users -> shared banks only displayed for correct user
- filter by languages works
  - correct dir
  - reverse dir
  - one empty correct dir
  - one empty reverse dir

## frontend

- check practice process
- import merge correct

## shared

- about page:
  - short what is lingo lizard
  - longer: tutorial
    - usecases (with real live examples)
    - per page explanations
- add matches endpoint, returning existing matches
  - use existing matches as recommendations on shared page (bottom) and explore page select match popover

## Backend

- hide server errors from fe
- search in both directions
- add ratelimiting?
- add inbetween layer to backend
  - maps adds baseLanguage to banks (byrisch -> german)
  - allows better matching and recommendation system
- add build prod for backend -> new tsc without sorucemaps and optimization and stuff
- use some cheap openai model to srip shared banks from obscene language and stuff

## Frontend

- How to handle reverse matches in fe on import?
- greadeziehen:
  - Bank gross schrieben
  - punkt nach toasts
- unify styles for:
  - tutorial and practice config
- show in which collections card is in form
- remove height hack?
- add state indicator component?
  - handles loading, no-data, error, etc
- check if i can live without the height hack but with overscroll css˜
- remove or reimplement cardsfilter logic in frontend
- migrate to signal forms, migrate selector thingy to signal input
- check chrome web manifest warnings -> fix
- unify big approvable form layout for: practice selector, bank import -> make it soo it looks like intro comp
- create text classes with line height?
- move api fetch state indicator of shared and export into component -> double css and fetchState indicator template
- get rid of angular-architects helper
  - remove -f from ci build
- in overview for every langague in users banks a category

- show 'wiggle' and info toast every x seconds when user doesnt interact for y seconds,
- swipes count in stats
- add html lang call to ai service, save it as option in language config.
- change blobcreation and download to happen on click, not in a reactive manner -> faster
  - implement in overview, share and settings

- unifiy type setup:
  - clean up overview page and facade thoroughly
  - store, export and import are wordbanks (types and stuff)
  - collection can have collections
  - collections can be stacked

- refactor bulkEdit mit add altest ids and mark them in overview facede and overview

- deploy via cloudflare pages, worker and upstash redis
- add load more cards on scroll / pagination?

- stats page:
  - has practice history -> you can see cards here, most held card and stuff

make settinggsstore simple service with update function and effect that writes to sessionstorage?

## Later

- how to handle sharing multiple selection
- stats page with collections, top and worst, most ppracticed, hardest words, progressgraph
- enter leave directive
- split create cards exactly like i split phrases
- erst mal alles bauen, dann capital yo
- collection ids on cards?
- fix openai + zod issue: remove helper function from utils
- print view
- implement protected and private corrrectly throughout

## Idea

- style everything like real cards
- wide page: cards
- mid page: a4 sheet
- header: small note
- light: desk
- dark: desk with light cards

# sources

https://remixicon.com/icon/arrow-up-s-line

## Hosting

https://www.netcup.com/en/deals
hetzner

## Put in readme

whats an ai key

wenn quit early:
summarycard: nicht aufdeckbar, sobald gezogen immer aufgedeckt

- ersetze aktuellen array mit fake array. Das erlaubt das index weiterbewegen ohne dependency auf practice. dieser hat:
  - auf -1 letzte karte
  - auf 0 aktuelle karte
  - auf 1 summary
- lege aktuelle 0 karte weg ohne vote, sodass summary nach rueckt
- mit viwmodelIndex arbeiten?
