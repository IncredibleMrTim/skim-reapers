# Design & Planning

## Figma / FigJam

Site map and page content: https://www.figma.com/board/KGKqZOZSafHcnOEBdl4Brn/Untitled (file key `KGKqZOZSafHcnOEBdl4Brn`) — navigation, per-page copy and layout notes, and the "Price Brakdown" section (Pro Plan vs paid extras).

Before building or changing a page, read it with `mcp__figma__get_figjam` (node `0:1` = whole board). Check the price breakdown before building anything marked as an extra (multi-gallery Our Work, Reviews, Application, Policy & T&Cs).

## Trello

Board **SkimReapers**: https://trello.com/b/FqCurGAM/skimreapers (id `6aa2cf1d13b7f10e2d061e9c`). Lists: Backlog, Queued, In Progress, In Review, Done, Blocked. New cards go in Backlog.

Titles: `[Page Name or Task Category] Task description`, task in sentence case — e.g. `[Our Work] Build page layout and route`, `[Our Work] Category filter`, `[CMS] Add Sanity schema for reviews`. Use the page name when the card belongs to one page, else a category like `[CMS]`, `[Content]`, `[Deploy]`. Put detail (FigJam notes, pricing caveats, open questions) in the description, not the title.

Reference the card in the commit body by its short link (see Commits in `CLAUDE.md`).
