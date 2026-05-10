# ToDo

# New page

## General navigation

- interaction elements always bottom: configire practice, stats timeline, translate, edit cards ?

# right now: Stats

- stats: show cards guessed count, this is the only important thing: practice!!!!
- in graphs: cards guesse, do histogramm
- Show timeline on top: same as on dashboard page
- show history items sorted by day, cool timelne left oder so
- put end of practice stickers somewhere prominent on ollection
- confidence formula: card \* card confidence -> so beintraechtigt hinzufuegen von karten nicht die confidence
- confidence = confidence per cards = higher score, higher impressiveness!
- items on timeline: practices?

- show practice cards?

## General

- colors: cards, practice, community -> create named accent variables!
- replace single confidence with both directions confidenc to allow user deciding on direction before start
- add automatism that automatically selects the worst direction?
- create component to show confidence (general %, forward, backwards)
- streamline colors, give practice, collection and cards on color wich is not UI color
- use caroussel on shared page
- use ng-icon instead of my custom solution
- add layout helper scss

### Stats

- make more obvious what the cound is
- add weekly average cards guessed
- addd dayly average cards guessed

## Dashboard

### Practice handling

- add: add select all option to magic generate
- use: shared, cards collection select

- add practice history

- on practice config: show, instead of the select, the same categories as on dashboard page

- filter doppelresponses aus preview
- selektiere zom importieren / importiere alle bubbles oder button
- tokenuse digram in stats
- handle exporting and import bank not working:
  - imported bank keeps name, but does not keep collection if languages divert
- store, relevant for magic add:
  - adding cards with creating new collection not yet possible
- somehow streamline the notifications after adding learnables -> shared facade service?

# Infra

- CD: Create folder per succesfull deployment to allow rollback to date
  - configure drizzle to also generate rollback files
  - naming scheme of folder: timestamp_commitsha
  - delete folder of failed deployment: history only contains succesfull rollackable deployments
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

- use icons for confidence / percent to be shown everywhere instead of text
- change translate direction on translate page
- make error thingy on community same as empty state -> component?
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

## How scores are calculated

- save guesses instead of true false on cards
- let true and false influence, but not guesses yet not

## Store

- Create shared facade, that calls modalService and sends toasts and stuff
  - on add: allow providing new collection name
  - show toast: adde, skipped,
- use on magic add and overvew

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

### Documentation

- explain spaced rep, explai wuick actions and their difference

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

- How to handle reverse matches in fe on import?

- unify styles for:
  - tutorial and practice config
- show in which collections card is in form
- add state indicator component?
  - handles loading, no-data, error, etc
- migrate to signal forms, migrate selector thingy to signal input
- check chrome web manifest warnings -> fix
- unify big approvable form layout for: practice selector, bank import -> make it soo it looks like intro comp
- create text classes with line height?
- move api fetch state indicator of shared and export into component -> double css and fetchState indicator template
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

- stats page:
  - has practice history -> you can see cards here, most held card and stuff

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

Learn a new Laguage with larry the lizard!
