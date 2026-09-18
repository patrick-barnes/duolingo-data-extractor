import ToJyutping from 'to-jyutping';

const customJyutping = ToJyutping.customize({
    // Polyphone disambiguations & colloquial usage improvements
    '瞓咗覺': 'fan3 zo2 gaau3', // 
    '數過': 'sou2 gwo3',
    '當佢': 'dong3 keoi5',
    '方便': 'fong1 bin6', // not necessary?
    '便宜': 'pin4 ji4',
    '呢幾': 'ni1 gei2',
    '處理': 'cyu2 lei5',
    '三處': 'saam1 cyu3',
    '春天種': 'ceon1 tin1 zung3',
    '請': 'cing2',
    '影相': 'jing2 soeng3',
});

export function transliterateCantonese(cantoneseText: string): string {
    return customJyutping.getJyutpingText(cantoneseText);
}
