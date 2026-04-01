import { pinyin } from 'pinyin';

export function transliterateChinese(chineseText: string): string {
    
    const result = pinyin(chineseText, {
        // segment: true is better. For example, 长大 is transliterated to zhǎngdà instead of chángdà
        segment: true,
        // heteronym: false is better for making simple straightforward flashcards with a single pronuncation
        heteronym: false,
    });
    let transliteration = result.map(item => item[0]).join(' ');
    return transliteration;
}
