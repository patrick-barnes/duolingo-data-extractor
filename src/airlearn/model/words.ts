export interface Script {
    pronunciation: string; // "Ruǎn",
    text: string; // "​​软"
}

export interface Word {
    text: string; // "<highlight ...>​​软件</highlight> (ruǎnjiàn)",
    word_type: string; // "NOUN",
    word_audio: string; // "https://d3m2sqtxtsp3kk.cloudfront.net/audio-content/RCN4S4T8BHW336T.mp3",
    pronounciation: string; // "[ruǎnjiàn]",
    description: string; // "<highlight ...>​​软件</highlight> <highlight ..>(ruǎnjiàn)</highlight> means ‘software’ in Mandarin.",
    meaning: string; // "Software",
    word_image: string; // "",
    script: Script[];
    uid: string; // "e5f190f3-4a6f-4c3e-b7c7-7b1b90e6eae7",
    is_important: number; // 0,
    tag: string; // "default"
}

export interface Category {
    tag: string;
    categories: string;
    order: number;
}

export interface GetV1ContentWordsResponse {
  prev: string; // "",
  next: string; // "?limit=50&offset=50",
  count: number; // 764,
  data: {
    words: Word[];
    order: number; // 2,
    type: number; // 2,
    content_font_family: string; // "han",
    pronunciation_font_family: string; // "han",
    categories: Category[];
  }
};
