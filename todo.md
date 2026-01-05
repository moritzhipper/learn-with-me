# ToDo

## Right Now

- add PSQL DB: https://dev.to/vladimirvovk/fastify-api-with-postgres-and-drizzle-orm-a7j
  -> add seeding script to packag json for testing and local dev
- read env file using zod
  -> read db config
  -> read backend url and port
- create tables having columns
  - id UUID PKEY, speaking STRING, learning STRING, hits LONG, created DATE, banks JSONB (having collections and cards)
- connect db in handler methods

### Add API Routes returning []

### Connect DB

- fetch entries on api call

## shared

- increase download only for userid
- prevent users from resharing same unchanged bank
- setup CI
- buy domain lol
- add matches endpoint, returning existing matches
  - use existing matches as recommendations on shared page (bottom) and explore page select match popover

## Backend

- add inbetween layer to backend
  - maps adds baseLanguage to banks (byrisch -> german)
  - allows better matching and recommendation system
- make bank request languages optional -> return for all languages for left out language
- add build prod for backend -> new tsc without sorucemaps and optimization and stuff
- use some cheap openai model to srip shared banks from obscene language and stuff
- move routes to shared folder
- remove schemas folder from frontend, clean up tyoes folder in forntend

## Frontend

- use stagger animation for explore pages to also apply to the loading indicator animation
- add states to explore pages:
  - api works, but no categories filled
  - api absent -> backend absent :(
- migrate to signal forms, migrate selector thingy to signal input
- check chrome web manifest warnings -> fix
- add no cards found when filter doesnt find cards
- add header to select practice page
- unify big approvable form layout for: practice selector, bank import -> make it soo it looks like intro comp
- setup PWA
- create text classes with line height?
- move api fetch state indicator of shared and export into component -> double css and fetchState indicator template
- get rid of angular-architects helper
  - remove -f from ci build
- in overview for every langague in users banks a category
- move shared-bank outputs to shared service
- community shares
  - section trending: all languages
  - section for you: shares having your language
  - add see more for each section
  - show five top per section, then link to new page for more

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

- add merge learnables function to mutoators: when a lexeme exists, but the words dont match: update the translation to trans1 / trans2
- refactor bulkEdit mit add altest ids and mark them in overview facede and overview

- deploy via cloudflare pages, worker and upstash redis
- add load more cards on scroll / pagination?

- stats page:
  - has practice history -> you can see cards here, most held card and stuff

make settinggsstore simple service with update function and effect that writes to sessionstorage?

## Later

- link similar cards (multiple translations)
- how to handle sharing multiple selection
- stats page with collections, top and worst, most ppracticed, hardest words, progressgraph
- enter leave directive
- split create cards exactly like i split phrases
- erst mal alles bauen, dann capital yo
- collection ids on cards?
- fix openai + zod issue: remove helper function from utils
- print view
- implement protected and private corrrectly throughout

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
