// Forked from crayon-js/crayon's src/extensions/color_support.ts
// Copyright 2022 Im-Beast. MIT license.
// Copyright 2022 idanran. MIT license.

import { env, platform } from 'node:process'
import os from 'node:os'
import { ColorSupport, colorSupport, ColorSupportLevel } from './share'

export function getColorSupport(): ColorSupport {
	const no_color = env.NO_COLOR
	if (no_color !== undefined) {
		return colorSupport(ColorSupportLevel.none)
	}

	const colorTerm = env.COLORTERM
	if (colorTerm !== undefined) {
		switch (colorTerm) {
			case "truecolor":
				return colorSupport(ColorSupportLevel.bit24)
			default:
				return colorSupport(ColorSupportLevel.bit4)
		}
	}

	const term_program = env.TERM_PROGRAM
	if (term_program !== undefined) {
		switch (term_program) {
			case 'iTerm.app': {
				const version = Number.parseInt((env.TERM_PROGRAM_VERSION!).split('.')[0], 10)
				return colorSupport(version >= 3 ? ColorSupportLevel.bit24 : ColorSupportLevel.bit8)
			}
			case 'Apple_Terminal':
				return colorSupport(ColorSupportLevel.bit8)
			// No default
		}
	}

	const term = env.TERM
	if (term && /-?256(color)?/gi.test(term)) {
		return colorSupport(ColorSupportLevel.bit8)
	}
	if (term && /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(term)) {
		return colorSupport(ColorSupportLevel.bit4)
	}

	const CIs = [
		"TRAVIS",
		"CIRCLECI",
		"GITLAB_CI",
		"BUILDKITE",
		"DRONE",
		"APPVEYOR",
	]
	const ci = env.CI
	if (ci !== undefined && env.GITHUB_ACTIONS !== undefined) {
		return colorSupport(ColorSupportLevel.bit24)
	}
	if (ci !== undefined && (CIs.some((ci) => env[ci] !== undefined) || env.CI_NAME === 'codeship')) {
		return colorSupport(ColorSupportLevel.bit4)
	}

	const teamcity_version = env.TEAMCITY_VERSION
	if (teamcity_version !== undefined) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(teamcity_version) ? colorSupport(ColorSupportLevel.bit4) : colorSupport(ColorSupportLevel.none)
	}

	// Check for Azure DevOps pipelines
	const tf_build = env.TF_BUILD
	const agent_name = env.AGENT_NAME
	if (tf_build !== undefined && agent_name !== undefined) {
		return colorSupport(ColorSupportLevel.bit4)
	}

	if (platform === 'win32') {
		// Windows 10 build 10586 is the first release that supports 256 colors.
		// Windows 10 build 14931 is the first release that supports 16m Color.
		const [, , releaseNum] = os.release().split(".").map(Number)
		if (releaseNum >= 14931) {
			return colorSupport(ColorSupportLevel.bit24)
		}
		if (releaseNum >= 10586) {
			return colorSupport(ColorSupportLevel.bit8)
		}
		return colorSupport(ColorSupportLevel.bit4)
	}

	return colorSupport(ColorSupportLevel.none)
}