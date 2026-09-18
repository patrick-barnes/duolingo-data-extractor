import { describe, it, expect } from 'vitest';
import { transliterateCantonese } from './cantonese-transliterator.js';

const dataset = [
  {
    "sentence": "我行去銀行。",
    "jyutping": "ngo5 haang4 heoi3 ngan4 hong4",
    "characterTested": "行",
    "pronunciations": ["haang4", "hong4"]
  },
  {
    "sentence": "呢件衫好重，但唔重要。",
    "jyutping": "ni1 gin6 saam1 hou2 cung5, daan6 m4 zung6 jiu3",
    "characterTested": "重",
    "pronunciations": ["cung5", "zung6"]
  },
  {
    "sentence": "條路好長，佢係我哋嘅家長。",
    "jyutping": "tiu4 lou6 hou2 coeng4, keoi5 hai6 ngo5 dei6 ge3 gaa1 zoeng2",
    "characterTested": "長",
    "pronunciations": ["coeng4", "zoeng2"]
  },
  {
    "sentence": "佢鍾意音樂，聽得好快樂。",
    "jyutping": "keoi5 zung1 ji3 jam1 ngok6, teng1 dak1 hou2 faai3 lok6",
    "characterTested": "樂",
    "pronunciations": ["ngok6", "lok6"]
  },
  {
    "sentence": "呢間餐廳又方便又便宜。",
    "jyutping": "ni1 gaan1 caan1 teng1 jau6 bin6 fong1 jau6 pin4 ji4",
    "characterTested": "便",
    "pronunciations": ["bin6", "pin4"]
  },
  {
    "sentence": "我覺得佢瞓咗覺。",
    "jyutping": "ngo5 gok3 dak1 keoi5 fan3 zo2 gaau3",
    "characterTested": "覺",
    "pronunciations": ["gok3", "gaau3"]
  },
  {
    "sentence": "佢好好學，成績亦都好。",
    "jyutping": "keoi5 hou2 hou3 hok6, sing4 zik1 jik6 dou1 hou2",
    "characterTested": "好",
    "pronunciations": ["hou2", "hou3"]
  },
  {
    "sentence": "我數過呢幾個數字。",
    "jyutping": "ngo5 sou2 gwo3 ni1 gei2 go3 sou3 zi6",
    "characterTested": "數",
    "pronunciations": ["sou2", "sou3"]
  },
  {
    "sentence": "當時我當佢係朋友。",
    "jyutping": "dong1 si4 ngo5 dong3 keoi5 hai6 pang4 jau5",
    "characterTested": "當",
    "pronunciations": ["dong1", "dong3"]
  },
  {
    "sentence": "冠軍戴住皇冠。",
    "jyutping": "gun3 gwan1 daai3 zyu6 wong4 gun1",
    "characterTested": "冠",
    "pronunciations": ["gun3", "gun1"]
  },
  {
    "sentence": "呢本傳記講文化傳播。",
    "jyutping": "ni1 bun2 zyun6 gei3 gong2 man4 faa3 cyun4 bo3",
    "characterTested": "傳",
    "pronunciations": ["zyun6", "cyun4"]
  },
  {
    "sentence": "佢處理咗三處問題。",
    "jyutping": "keoi5 cyu2 lei5 zo2 saam1 cyu3 man6 tai4",
    "characterTested": "處",
    "pronunciations": ["cyu2", "cyu3"]
  },
  {
    "sentence": "朝早講起唐朝。",
    "jyutping": "ziu1 zou2 gong2 hei2 tong4 ciu4",
    "characterTested": "朝",
    "pronunciations": ["ziu1", "ciu4"]
  },
  {
    "sentence": "佢用鎖匙攪勻一茶匙糖。",
    "jyutping": "keoi5 jung6 so2 si4 gaau2 wan4 jat1 caa4 ci4 tong4",
    "characterTested": "匙",
    "pronunciations": ["si4", "ci4"]
  },
  {
    "sentence": "呢種花要春天種。",
    "jyutping": "ni1 zung2 faa1 jiu3 ceon1 tin1 zung3",
    "characterTested": "種",
    "pronunciations": ["zung2", "zung3"]
  },
  {
    "sentence": "請分一份畀我。",
    "jyutping": "cing2 fan1 jat1 fan6 bei2 ngo5",
    "characterTested": "分",
    "pronunciations": ["fan1", "fan6"]
  },
  {
    "sentence": "我哋互相影相。",
    "jyutping": "ngo5 dei6 wu6 soeng1 jing2 soeng3",
    "characterTested": "相",
    "pronunciations": ["soeng1", "soeng3"]
  },
  {
    "sentence": "警方調查後調整安排。",
    "jyutping": "ging2 fong1 diu6 caa4 hau6 tiu4 zing2 on1 paai4",
    "characterTested": "調",
    "pronunciations": ["diu6", "tiu4"]
  },
  {
    "sentence": "呢張係假機票，我放假先發現。",
    "jyutping": "ni1 zoeng1 hai6 gaa2 gei1 piu3, ngo5 fong3 gaa3 sin1 faat3 jin6",
    "characterTested": "假",
    "pronunciations": ["gaa2", "gaa3"]
  },
  {
    "sentence": "呢題唔難，但災難好難避免。",
    "jyutping": "ni1 tai4 m4 naan4, daan6 zoi1 naan6 hou2 naan4 bei6 min5",
    "characterTested": "難",
    "pronunciations": ["naan4", "naan6"]
  }
];

describe('transliterateCantonese', () => {
  it.each(dataset)(
    'should correctly transliterate "$sentence" with context-dependent pronunciations of "$characterTested"',
    ({ sentence, pronunciations, characterTested }) => {
      const result = transliterateCantonese(sentence);

      // Verify each tested polyphonic pronunciation is produced in the transliteration
      for (const expectedPronunciation of pronunciations) {
        expect(result).toContain(expectedPronunciation);
      }
    }
  );
});
