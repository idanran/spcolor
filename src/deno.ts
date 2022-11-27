// Forked from crayon-js/crayon's src/extensions/color_support.ts
// Copyright 2022 Im-Beast. MIT license.
// Copyright 2022 idanran. MIT license.

import { ColorSupport, colorSupport, ColorSupportLevel } from './share'

declare namespace Deno {
  export const noColor: boolean
  export interface Env {
    get(key: string): string | undefined
    set(key: string, value: string): void
    delete(key: string): void
    toObject(): { [index: string]: string }
  }
  export const env: Env
  export const build: {
    target: string
    arch: "x86_64" | "aarch64"
    os: "darwin" | "linux" | "windows"
    vendor: string
    env?: string
  }
  export function osRelease(): string
}

export function getColorSupport(): ColorSupport {
  if (Deno.noColor) return colorSupport(ColorSupportLevel.none)

  const colorTerm = Deno.env.get("COLORTERM")
  if (colorTerm !== undefined) {
    switch (colorTerm) {
      case "truecolor":
        return colorSupport(ColorSupportLevel.bit24)
      default:
        return colorSupport(ColorSupportLevel.bit4)
    }
  }

  const term_program = Deno.env.get("TERM_PROGRAM")
  if (term_program !== undefined) {
    switch (term_program) {
      case 'iTerm.app': {
        const version = Number.parseInt((Deno.env.get("TERM_PROGRAM_VERSION")!).split('.')[0], 10)
        return colorSupport(version >= 3 ? ColorSupportLevel.bit24 : ColorSupportLevel.bit8)
      }
      case 'Apple_Terminal':
        return colorSupport(ColorSupportLevel.bit8)
      // No default
    }
  }

  const term = Deno.env.get("TERM")
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
  const ci = Deno.env.get("CI")
  if(ci !== undefined && Deno.env.get('GITHUB_ACTIONS') !== undefined){
    return colorSupport(ColorSupportLevel.bit24)
  }
  if (ci !== undefined && (CIs.some((ci) => Deno.env.get(ci) !== undefined) || Deno.env.get('CI_NAME') === 'codeship')) {
    return colorSupport(ColorSupportLevel.bit4)
  }

  const teamcity_version = Deno.env.get("TEAMCITY_VERSION")
  if (teamcity_version !== undefined) {
    return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(teamcity_version) ? colorSupport(ColorSupportLevel.bit4) : colorSupport(ColorSupportLevel.none)
  }

  // Check for Azure DevOps pipelines
  const tf_build = Deno.env.get("TF_BUILD")
  const agent_name = Deno.env.get("AGENT_NAME")
  if (tf_build !== undefined && agent_name !== undefined) {
    return colorSupport(ColorSupportLevel.bit4)
  }

  if (Deno.build.os === "windows") {
    // Windows 10 build 10586 is the first release that supports 256 colors.
    // Windows 10 build 14931 is the first release that supports 16m Color.
    const [, , releaseNum] = Deno.osRelease().split(".").map(Number)
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