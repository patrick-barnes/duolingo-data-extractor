# DuoLingo Data Extractor

Extracts data from DuoLingo and makes flashcards.

For examples of generated flashcards, see:

- `output-example`

## Initial setup

1. `npm install`

2. Copy `.env.example` to `.env`

3. Configure `.env`

- set `USER_ID` to your DuoLingo User ID
- set `JWT` to your DuoLingo JWT token
- set `COURSE_NAME` per the language


## Usage

1. `npm run fetch-current-course`

2. `npm run fetch-lexemes` to fetch words data

3. `npm run fetch-sessions` for fetch sentences data

4. `npm run make-flashcards` to create flashcards

Check the `output` folder for results.


## Known Bugs and Limitations

- When the target language is English itself, the `Foreign` and `English` column names are incorrect:
  - The `English` column is not English, and the `Foreign` column is native
- Transliteration/romanization is limited:
  - for some languages, not supported for sentences, only lexems (words)
  - for some languages, not supported at all
- In output-example/, for some languages, sentence flashcards are not provided, only lexemes


## How to get your DuoLingo USER_ID and JWT token

- Use Chrome Developer tools or similar to monitor network traffic
- Go to duolingo.com and log in
- Inspect network API calls to duolingo to find your USER_ID and JWT
  - JWT is in the Authorization header
