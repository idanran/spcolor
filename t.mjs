import os from 'node:os'
import {env} from 'node:process'
const a = os.release().split(".").map(Number)
console.log(env.TERM_PROGRAM_VERSION)