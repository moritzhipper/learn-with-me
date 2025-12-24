# ToDo

## Right Now

- initiate successfull get new entries call on app init
- add shared banks store in session storage with cacheables and refresh subjects
- add 'investigate' route wiht filiter options at top and pagination
  - opens when you click on arrow thingy
- add pagination to banks -> add init app call on app start calling top five for categories -> now viewlogic in fe
- make new and top filter options, not route params
- rename shared to community

## shared

- setup CI
- buy domain lol

## Backend

- make bank request languages optional -> return for all languages for left out language
- add build prod for backend -> new tsc without sorucemaps and optimization and stuff
- use some cheap openai model to srip shared banks from obscene language and stuff
- move routes to shared folder
- remove schemas folder from frontend, clean up tyoes folder in forntend

## Frontend

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
