import { AirLearnAPIClient } from "../api-client/api-client.js";

interface Note {
    //id: string;
    english: string;
    context: string;
    foreign: string;
    transliteration: string;
    tip: string;
    sources: string;
    debug: string;
};

function noteToTsvRow(note: Note): string {
    let row = [
        //note.id,
        note.english,
        note.context,
        note.foreign,
        note.transliteration,
        note.tip,
        note.sources,
        note.debug
    ].join('\t');
    return row;
}

// fetch learned lexemes data
let apiClient: AirLearnAPIClient = new AirLearnAPIClient();
apiClient.fetchAndSaveWords();
