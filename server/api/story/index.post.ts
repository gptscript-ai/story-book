import gptscript from '@gptscript-ai/gptscript'
import { Readable } from 'stream'

type Request = {
    prompt: string;
    pages: number;
}

export type RunningScript = {
    stdout: Readable;
    stderr: Readable;
    promise: Promise<void>;
}

export const runningScripts: Record<string, RunningScript>= {}

export default defineEventHandler(async (event) => {
    const request = await readBody(event) as Request

    if (!request.prompt) {
        throw createError({
            statusCode: 400,
            statusMessage: 'prompt is required'
        });
    }

    if (!request.pages) {
        throw createError({
            statusCode: 400,
            statusMessage: 'pages are required'
        });
    }

    const path = useRuntimeConfig().storiesVolumePath
    const {stdout, stderr, promise} = await gptscript.streamExecFile(
        'story-book.gpt', `--story ${request.prompt} --pages ${request.pages} --path ${path}`, {})

    setResponseStatus(event, 202)

    runningScripts[request.prompt] = {
        stdout: stdout,
        stderr: stderr,
        promise: promise
    }
})