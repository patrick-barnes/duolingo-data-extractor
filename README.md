# DuoLingo Data Extractor

Extracts data from DuoLingo and makes flashcards.

NEW: Also supports AirLearn, a DuoLingo competitor (limited).

For examples of generated flashcards, see:

- `output-example` (DuoLingo)
- `output-airlearn-example` (AirLearn)

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

1. In `.env`, set `AIRLEARN_JWT` to your AirLearn JWT token.

2. In `src/airlearn/config.ts`, set the language

3. `npm run airlearn-fetch-words` to create `words.json`

4. `npm run airlearn-make-flashcards` to create `lexeme-flashcards.tsv`

Check the `output-airlearn` folder for results.

Current limitations for AirLearn:
- creates only word flashcards, not sentence flashcards
- creates flashcards only for words you've already learned
