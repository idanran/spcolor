export const enum ColorSupportLevel {
    /** 16m color support */
    bit24 = 3,
    /** 256 color support */
    bit8 = 2,
    /** 16 color support */
    bit4 = 1,
    /** no color support */
    none = 0
}

export interface ColorSupport {
    level: ColorSupportLevel
    has24bit: boolean
    has8bit: boolean
    has4bit: boolean
}

export function colorSupport(level: ColorSupportLevel): ColorSupport {
    return {
        level,
        has24bit: level >= 3,
        has8bit: level >= 2,
        has4bit: level >= 1
    }
}