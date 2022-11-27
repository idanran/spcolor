export declare const enum ColorSupportLevel {
    /** no color support */
    noColor = 0,
    /** 16m color support */
    bit24 = 3,
    /** 256 color support */
    bit8 = 2,
    /** 16 color support */
    bit4 = 1
}
interface ColorSupport {
    level: ColorSupportLevel;
    has24bit: boolean;
    has8bit: boolean;
    has4bit: boolean;
}
export declare function getColorSupport(): ColorSupport;
export {};