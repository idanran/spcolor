# Spcolor

[![Codecov](https://img.shields.io/codecov/c/github/idanran/spcolor)](https://codecov.io/gh/idanran/spcolor)
[![NPM](https://img.shields.io/npm/v/spcolor)](https://www.npmjs.com/package/spcolor)
[![License](https://img.shields.io/github/license/idanran/spcolor)](https://github.com/idanran/spcolor/blob/main/LICENSE)

Detect whether a terminal supports color. Can run on Node, Browser, Deno.

## Usage

### Node.js

```sh
npm install spcolor
```

```ts
import { getColorSupport } from "spcolor";

console.log(getColorSupport());
```

### Deno

```ts
import { getColorSupport } from "npm:spcolor@latest";

console.log(getColorSupport());
```

## API

### getColorSupport()

- Return: `ColorSupport`

```ts
interface ColorSupport {
  level: ColorSupportLevel;
  has24bit: boolean;
  has8bit: boolean;
  has4bit: boolean;
}

const enum ColorSupportLevel {
  /** 16m color support */
  bit24 = 3,
  /** 256 color support */
  bit8 = 2,
  /** 16 color support */
  bit4 = 1,
  /** no color support */
  none = 0,
}
```
