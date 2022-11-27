// Forked from crayon-js/crayon's tests/color_support.test.ts
// Copyright 2022 Im-Beast. MIT license.
// Copyright 2022 idanran. MIT license.

import { getColorSupport } from '../src/node'
import { ColorSupportLevel } from '../src/share'
import assert from 'assert'
import { test } from 'mocha'
import process, { env } from 'node:process'
import os from 'node:os'

test("COLOTERM", () => {
    env.COLORTERM = "truecolor"

    assert.deepEqual(getColorSupport(), {
        has24bit: true,
        has8bit: true,
        has4bit: true,
        level: ColorSupportLevel.bit24
    })

    env.COLORTERM = ''
    assert.deepEqual(getColorSupport(), {
        has24bit: false,
        has8bit: false,
        has4bit: true,
        level: ColorSupportLevel.bit4
    })
})

test("NO_COLOR", () => {
    env.COLORTERM = "truecolor"
    env.NO_COLOR = ""

    assert.deepEqual(getColorSupport(), {
        has24bit: false,
        has8bit: false,
        has4bit: false,
        level: ColorSupportLevel.none
    })

    delete env.NO_COLOR
})

test("TERM", () => {
    env.TERM = "xterm-256"

    delete env.COLORTERM

    assert.deepEqual(getColorSupport(), {
        has24bit: false,
        has8bit: true,
        has4bit: true,
        level: ColorSupportLevel.bit8
    })

    env.TERM = 'rxvt'
    
    assert.deepEqual(getColorSupport(), {
        has24bit: false,
        has8bit: false,
        has4bit: true,
        level: ColorSupportLevel.bit4
    })
})

test("TERM_PROGRAM", () => {
    delete env.TERM
    delete env.COLORTERM

    env.TERM_PROGRAM = 'iTerm.app'
    env.TERM_PROGRAM_VERSION = '3.0.0'

    assert.deepEqual(getColorSupport(), {
        has24bit: true,
        has8bit: true,
        has4bit: true,
        level: ColorSupportLevel.bit24
    })

    env.TERM_PROGRAM_VERSION = '2.0.0'

    assert.deepEqual(getColorSupport(), {
        has24bit: false,
        has8bit: true,
        has4bit: true,
        level: ColorSupportLevel.bit8
    })

    env.TERM_PROGRAM = 'Apple_Terminal'

    assert.deepEqual(getColorSupport(), {
        has24bit: false,
        has8bit: true,
        has4bit: true,
        level: ColorSupportLevel.bit8
    })
})

test("CI", () => {
    delete env.TERM
    delete env.COLORTERM
    delete env.TERM_PROGRAM
    delete env.TERM_PROGRAM_VERSION

    env.CI = ""
    env.GITHUB_ACTIONS = ''

    assert.deepEqual(getColorSupport(), {
        has24bit: true,
        has8bit: true,
        has4bit: true,
        level: ColorSupportLevel.bit24
    })

    delete env.GITHUB_ACTIONS

    for (
        const ciEnv of [
            "TRAVIS",
            "CIRCLECI",
            "GITLAB_CI",
            "BUILDKITE",
            "DRONE",
            "APPVEYOR",
        ]
    ) {
        env[ciEnv] = ''

        assert.deepEqual(getColorSupport(), {
            has24bit: false,
            has8bit: false,
            has4bit: true,
            level: ColorSupportLevel.bit4
        })

        delete env[ciEnv]
    }
    env.CI_NAME = 'codeship'

    assert.deepEqual(getColorSupport(), {
        has24bit: false,
        has8bit: false,
        has4bit: true,
        level: ColorSupportLevel.bit4
    })

    delete env.CI_NAME
})

test('TEAMCITY_VERSION', () => {
    delete env.TERM
    delete env.COLORTERM
    delete env.TERM_PROGRAM
    delete env.TERM_PROGRAM_VERSION
    delete env.CI

	env.TEAMCITY_VERSION = '9.0.5 (build 32523)'

    assert.deepEqual(getColorSupport(), {
        has24bit: false,
        has8bit: false,
        has4bit: false,
        level: ColorSupportLevel.none
    })

    env.TEAMCITY_VERSION = '9.1.0 (build 32523)'

    assert.deepEqual(getColorSupport(), {
        has24bit: false,
        has8bit: false,
        has4bit: true,
        level: ColorSupportLevel.bit4
    })
})

test('TF_BUILD AGENT_NAME', () => {
    delete env.TERM
    delete env.COLORTERM
    delete env.TERM_PROGRAM
    delete env.TERM_PROGRAM_VERSION
    delete env.CI
    delete env.TEAMCITY_VERSION

	env.TF_BUILD = ''
    env.AGENT_NAME = ''

    assert.deepEqual(getColorSupport(), {
        has24bit: false,
        has8bit: false,
        has4bit: true,
        level: ColorSupportLevel.bit4
    })
})

test("Windows 10+/14931+", () => {
    delete env.CI
    delete env.TERM
    delete env.COLORTERM
    delete env.TERM_PROGRAM
    delete env.TERM_PROGRAM_VERSION
    delete env.TEAMCITY_VERSION
    delete env.TF_BUILD
    delete env.AGENT_NAME

    Object.defineProperty(process, 'platform', {
        value: 'win32',
    })

    os.release = () => '10.0.14931'

    assert.deepEqual(getColorSupport(), {
        has24bit: true,
        has8bit: true,
        has4bit: true,
        level: ColorSupportLevel.bit24
    })

    os.release = () => '10.0.10586'

    assert.deepEqual(getColorSupport(), {
        has24bit: false,
        has8bit: true,
        has4bit: true,
        level: ColorSupportLevel.bit8
    })

    os.release = () => '6.3.9600'

    assert.deepEqual(getColorSupport(), {
        has24bit: false,
        has8bit: false,
        has4bit: true,
        level: ColorSupportLevel.bit4
    })
})