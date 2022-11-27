// Forked from chalk/supports-color
// Copyright Sindre Sorhus. MIT license.
// Copyright idanran. MIT license.

import { ColorSupport, colorSupport, ColorSupportLevel } from './share'

export function getColorSupport(): ColorSupport {
	// @ts-ignore
	if (navigator.userAgentData) {
		// @ts-ignore
		const brand: userAgentData = navigator.userAgentData.brands.find(({ brand }) => brand === 'Chromium');
		if (brand && brand.version > 93) {
			return colorSupport(ColorSupportLevel.bit24)
		}
	}
	if (/\b(Chrome|Chromium)\//.test(navigator.userAgent)) {
		return colorSupport(ColorSupportLevel.bit4)
	}
	return colorSupport(ColorSupportLevel.none)
}