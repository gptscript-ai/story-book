import gptscript from '@gptscript-ai/gptscript'
import { Readable } from 'stream'

type Request = {
    prompt: string;
    pages: number;
}

export type RunningScript = {
    prompt: string;
    stdout: Readable;
    stderr: Readable;
    promise: Promise<void>;
    completed?: boolean;
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

    const {storiesVolumePath, scriptPath, gptscriptCachePath} = useRuntimeConfig()
    const opts: { cacheDir?: string } = gptscriptCachePath ? { cacheDir: gptscriptCachePath } : {}
    console.log(opts)
    const {stdout, stderr, promise} = await gptscript.streamExecFile(
        `${scriptPath}`, `--story ${request.prompt} --pages ${request.pages} --path ${storiesVolumePath}`, opts)

    const id = Math.random().toString(36).substring(2, 14);

    // mark the script as completed when the promise resolves
    promise.finally(() => {
        if (runningScripts[id]) {
            runningScripts[id].completed = true
        }
    });

    runningScripts[id] = {
        stdout: stdout,
        stderr: stderr,
        promise: promise,
        prompt: request.prompt
    }

    setResponseStatus(event, 202)
    event.node.res.end()
})