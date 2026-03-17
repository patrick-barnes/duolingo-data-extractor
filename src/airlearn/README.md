# AirLearn

AirLearn is a competitor of DuoLingo.

This folder contains source code for extracting data from AirLearn, similar to how the main project extracts data from DuoLingo.

# Status and Next Steps

## Bugs

[x] SECURITY ISSUE: JWT token is in public github!
- [x] make JWT come from environment variables for AirLearn
- [x] make JWT come from environment variables for DuoLingo
- [x] push all changes to github

## Features

[x] Fetch one batch of words and save to file
- [x] Fetch just a single batch of words (50)
- [x] Get working: `npm run airlearn-fetch-words`
- [x] Save JSON under `output-airlearn`
[ ] add typing for the AirLearn get words response

[ ] Fetch the full list of words by looping through all batches

[ ] Create Anki flashcards for words

[ ] Sample sentences

## Will not do

[ ] Images because copyright issues
