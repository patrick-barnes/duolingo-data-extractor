# DuoLingo Data Extractor

# How to make Anki flashcards

1. Copy `.env.example` to `.env` and set `JWT` to your DuoLingo JWT token.

2. Configure the language (`CURRENT_COURSE`) in `src/config.ts`

3. `npm run fetch-current-course`

4. `npm run fetch-lexemes`

5. `npm run fetch-sessions`

6. `npm run make-flashcards`
