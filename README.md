# DuoLingo Data Extractor

Extracts data from DuoLingo and makes flashcards.

## Initial setup

1. `npm install`

2. Copy `.env.example` to `.env`.

## Usage

### How to make Anki flashcards for DuoLingo

1. In `.env`, set `JWT` to your DuoLingo JWT token.

2. In `src/config.ts`, set the language

3. `npm run fetch-current-course`

4. `npm run fetch-lexemes`

5. `npm run fetch-sessions`

6. `npm run make-flashcards`

Check the `output` folder for results.

### How to make Anki flashcards for AirLearn

AirLearn is a DuoLingo competitor.

If you do not use AirLearn, ignore this feature.

Currently, DuoLingo is the primary purpose of this project,
while AirLearn is just an optional bonus feature.

Note: For AirLearn, this app is currently limited:
- it only creates 50 word flashcards (to be fixed soon)
- it does not create sentence flashcards (new feature planned soon-ish)
- it only creates flashcards that you have already learned (possibly a permanent limitation)

1. In `.env`, set `AIRLEARN_JWT` to your AirLearn JWT token.

2. In `src/airlearn/config.ts`, set the language

3. `npm run airlearn-fetch-words` to create `words.json`

4. `npm run airlearn-make-flashcards` to create `lexeme-flashcards.tsv`

Check the `output-airlearn` folder for results.
