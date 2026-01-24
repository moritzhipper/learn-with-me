# ToDo

## Right Now

# do before deployment

- add gecko on back of cards
- handle import when other language is selected
  - create new bank, when this match does not exist, show toast
  - add to bank, when existing, but not selected -> toast
  - add tp active bank, when existing and active
  - check why import not works
  - verifify that collections from bank exist after import
- add merge learnables function to mutoators: when a lexeme exists, but the words dont match: update the translation to trans1 / trans2
  - summary:
    - added, merged, skipped, affected IDs
    - select affected ids

## shared

- about page:
  - short what is lingo lizard
  - longer: tutorial
    - usecases (with real live examples)
    - per page explanations
- add matches endpoint, returning existing matches
  - use existing matches as recommendations on shared page (bottom) and explore page select match popover

## Backend

- search in both directions
- add ratelimiting?
- add inbetween layer to backend
  - maps adds baseLanguage to banks (byrisch -> german)
  - allows better matching and recommendation system
- add build prod for backend -> new tsc without sorucemaps and optimization and stuff
- use some cheap openai model to srip shared banks from obscene language and stuff

## Frontend

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
