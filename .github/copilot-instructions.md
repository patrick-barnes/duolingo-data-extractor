# Copilot Instructions for duolingo-data-extractor

## Quick Reference

**Setup:** Copy `.env.example` to `.env` and add your Duolingo JWT token  
**Load env vars:** See section below  
**Build:** `npm run build` (TypeScript compilation)  
**Run Scripts:** Each feature has its own script (see below)  
**No tests:** The project doesn't have a test suite configured

## Build & Run

### Environment Variables

Environment variables from `.env` are automatically loaded by all npm scripts via `dotenv-cli`. Simply create your `.env` file:

1. Copy `.env.example` to `.env`
2. Add your JWT tokens
3. Run any script — no manual setup needed

The scripts will automatically load `.env` before executing.

### Available Scripts

- **TypeScript Build:** `npm run build` — compiles `src/` to `dist/`
- **Individual Features:** Each npm script auto-builds before running:
  - `npm run fetch-current-course` — Fetch the current Duolingo course config
  - `npm run fetch-sessions` — Fetch learning session data
  - `npm run fetch-lexemes` — Fetch vocabulary (lexemes) data
  - `npm run explore-course` — Explore course structure
  - `npm run make-flashcards` — Generate Anki flashcards from fetched data
  - `npm run hindi-transliterator` — Transliterate Hindi text
  - `npm run airlearn-fetch-words` — Fetch words for AirLearn

## Project Architecture

### Primary Workflow (Main Purpose)
The project extracts learning data from Duolingo and generates Anki flashcards. The typical workflow is:

1. Update JWT token in `src/api-client/api-client.ts` if needed
2. Select target language in `src/config.ts` (currently defaults to Arabic)
3. Run `npm run fetch-current-course`
4. Run `npm run fetch-lexemes`
5. Run `npm run fetch-sessions`
6. Run `npm run make-flashcards`

### Directory Structure

- **`src/api-client/`** — Duolingo API client with rate limiting (1000ms between calls)
  - `api-client.ts` — Main API wrapper (contains hardcoded JWT and user ID)
  - `all-challenge-types.ts` — Challenge type definitions
  
- **`src/model/`** — TypeScript types for domain objects
  - `courses.ts` — Course definitions (Arabic, Spanish, Chinese, Hindi, etc.)
  - `lexemes.ts` — Vocabulary/word definitions
  - `session.ts` — Learning session data
  - `user.ts` — User and course information
  
- **`src/` (root level)** — Main executable scripts
  - `fetch-*.ts` — API data fetchers
  - `make-flashcards.ts` — Converts fetched data to Anki format
  - `markdown-transformer.ts` — Data transformation utilities
  - `file-util.ts` — File I/O helpers
  
- **`python/`** — Transliteration utilities
  - `app.py` — Indic script transliteration
  - `transliterator/` — Supporting modules

- **`output/`, `output-airlearn/`, `cache/`, `data/`** — Data directories (built at runtime)

### Configuration & Secrets

- **API Credentials:** Configured via environment variables
  - Copy `.env.example` to `.env` and add your JWT token
  - `JWT` environment variable is read by `src/api-client/api-client.ts`
  - `.env` is gitignored — never commit it
  - JWT tokens have very long expiration (timestamp: 6307200000)
  - Update JWT when it expires or API returns 401
  
- **Language Selection:** `src/config.ts`
  - Set `CURRENT_COURSE` to select target language
  - Supported: Arabic, Spanish, Chinese, Hindi, Japanese, Russian, Korean, Telugu, Tagalog
  - Also defines `keysToIgnore` — API response fields to exclude from output
  
### Data Handling Conventions

- **API Rate Limiting:** Built into APIClient with 1-second delays between requests
- **Data Filtering:** `keysToIgnore` in `config.ts` controls which API fields are kept
  - Many UI/metadata fields are stripped (animations, avatars, internal IDs)
  - Core fields for language learning are preserved (prompts, solutions, translations, metadata)
  
- **File Naming:** Courses named by ID (e.g., `course_<id>.json`)
  - Utility: `getCourseJsonFilenameByCourseId()` in `file-util.ts`

## TypeScript Configuration

- **Target:** ES2020+ (nodenext modules)
- **Strict Mode:** Enabled with additional safety checks
  - `noUncheckedIndexedAccess` — Prevents unsafe array access
  - `exactOptionalPropertyTypes` — Strict optional properties
  - `noUncheckedSideEffectImports` — Warns on side-effect imports
- **Output:** Source maps and type declarations generated
- **ESM Module:** Native ES modules (type: "module" in package.json)

## Key Dependencies

- **`typescript`** — ^5.9.2 (compilation)
- **Language Support:**
  - `@indic-tools/hindi-transliterate` — Hindi script conversion
  - `arabic-transliterate` — Arabic transliteration
  - `arabscript` — Arabic script utilities

## Common Patterns

### Adding a New Script
1. Create `src/my-script.ts` importing `APIClient` and config
2. Add `"my-script": "tsc && node dist/my-script.js"` to `package.json`
3. Script automatically has access to API client with rate limiting

### Modifying API Responses
1. Update `keysToIgnore` in `src/config.ts` to exclude/include fields
2. API response filtering happens in APIClient transformations
3. Rebuilt data is written to `output/` directory

### Supporting a New Language
1. Add course definition to `src/model/courses.ts`
2. Update `src/config.ts` to enable it
3. Run through the standard workflow (fetch → make flashcards)
