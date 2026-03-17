import * as transliterateModule from '@indic-tools/hindi-transliterate';

const transliterateFunc: ((input: string, sanskritMode?: boolean) => string) = (transliterateModule as any).transliterate;

//const text = 'नमस्ते';
//const result = transliterateFunc(text, false);
//console.log(result);

export function transliterateHindi(hindiText: string): string {
    let t = hindiText;
    //t = t.replaceAll("ं", "n"); // fix for anusvara
    t = transliterateFunc(t, false);
    t = t.replaceAll("।", "."); // not a pipe symbol, but the Hindi danda punctuation mark
    t = t.replaceAll("a़", "");
    t = t.replaceAll("ḍh", "ṛ");
    t = t.replaceAll("ḍ", "ṛ");
    t = t.replaceAll("ख़", "qh");
    t = t.replaceAll("ज़", "z");
    t = t.replaceAll("फ़", "f");
    return t;
}
