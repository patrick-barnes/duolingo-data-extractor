import arabscript from "arabscript";

export function transliterateArabic(arabicText: string): string {
    //let preText = arabicText.replaceAll("ة", "=");
    //let t = arabscript(preText);
    let t = arabscript(arabicText);
    t = t.replaceAll("ǧ", "j");
    t = t.replaceAll("ʿ", "3");
    t = t.replaceAll("'", "2");
    t = t.replaceAll("š", "sh");
    t = t.replaceAll("ā", "aa");
    t = t.replaceAll("ī", "ii");
    t = t.replaceAll("ī", "ii");
    t = t.replaceAll("w", "uu");
    t = t.replaceAll("ḍ", "D");
    t = t.replaceAll("ṭ", "T");
    t = t.replaceAll("ḥ", "H");
    t = t.replaceAll("ṣ", "S");
    t = t.replaceAll("ḏ", "dh");
    t = t.replaceAll("ṯ", "th");
    t = t.replaceAll("ẖ", "kh");
    t = t.replaceAll("ġ", "gh");
    t = t.replaceAll("uua", "wa");
    t = t.replaceAll("uui", "wi");
    t = t.replaceAll("ỳ", "aa/"); // TODO
    // t = t.replaceAll("t ", "a/t "); // tamarbut
    // t = t.replaceAll("t$", "a/t"); // tamarbut
    return t;
}
