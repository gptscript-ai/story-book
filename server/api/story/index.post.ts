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

    const {storiesVolumePath, scriptPath} = useRuntimeConfig()
    const {stdout, stderr, promise} = await gptscript.streamExecFile(
        `${scriptPath}`, `--story ${request.prompt} --pages ${request.pages} --path ${storiesVolumePath}`, {})

    // mark the script as completed when the promise resolves
    promise.finally(() => {
        if (runningScripts[request.prompt]) {
            runningScripts[request.prompt].completed = true
        }
    });

    setResponseStatus(event, 202)

    runningScripts[request.prompt] = {
        stdout: stdout,
        stderr: stderr,
        promise: promise
    }
})