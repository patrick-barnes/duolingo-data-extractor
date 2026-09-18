import OpenCC from "opencc-js";

const traditionalToSimplified = OpenCC.Converter({
    from: "t",
    to: "cn",
});

export function transliterateTraditionalToSimplified(traditionalText: string): string {
    return traditionalToSimplified(traditionalText);
}
