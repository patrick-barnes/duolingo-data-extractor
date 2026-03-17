# DuoLingo Data Extractor

Extracts data from DuoLingo and makes flashcards.

## Initial setup

1. `npm install`

2. Copy `.env.example` to `.env`.

## Usage

### How to make Anki flashcards for DuoLingo

1. In `.env`, set `JWT` to your DuoLingo JWT token.

2. Configure the language (`CURRENT_COURSE`) in `src/config.ts`

3. `npm run fetch-current-course`

4. `npm run fetch-lexemes`

5. `npm run fetch-sessions`

6. `npm run make-flashcards`

Check the `output` folder for results.

### How to make Anki flashcards for AirLearn

Note: This feature is currently limited, it only creates 50 word flashcards.

1. In `.env`, set `AIRLEARN_JWT` to your AirLearn JWT token.

2. Configure the language (`AIRLEARN_CURRENT_GOAL`) in `src/airlearn/config.ts`

3. `npm run airlearn-fetch-words` to create `words.json`

4. `npm run airlearn-make-flashcards` to create `lexeme-flashcards.tsv`
