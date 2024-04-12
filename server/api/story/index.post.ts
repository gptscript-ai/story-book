import gptscript from '@gptscript-ai/gptscript'
import { Readable } from 'stream'
import type { StreamEvent, StoryRequest } from '@/lib/types'

export const runningScripts: Record<string, string>= {}
export const eventStream = new Readable({read(){}});

export default defineEventHandler(async (event) => {
    const request = await readBody(event) as StoryRequest

    // Ensure that the request has the required fields
    if (!request.prompt) { throw createError({
        statusCode: 400,
        statusMessage: 'prompt is required'
    })}
    if (!request.pages) { throw createError({
        statusCode: 400,
        statusMessage: 'pages are required'
    })}

    // Run the script with the given prompt and number of pages
    const {storiesVolumePath, scriptPath, gptscriptCachePath} = useRuntimeConfig()
    const opts: { cacheDir?: string } = gptscriptCachePath ? { cacheDir: gptscriptCachePath } : {}
    const {stdout, stderr, promise} = await gptscript.streamExecFile(
        `${scriptPath}`, `--story ${request.prompt} --pages ${request.pages} --path ${storiesVolumePath}`, opts)

    // Generate an ID and add it to the runningScripts object
    const id = Math.random().toString(36).substring(2, 14);
    runningScripts[id] = request.prompt

    // Setup listening for data that is received from the script. stdout is always the final message.
    stdout.on('data', (data) => {
        const outboundEvent: StreamEvent = {id, message: data.toString(), final: true}
        eventStream.push(`data: ${JSON.stringify(outboundEvent)}\n\n`)
    })
    stderr.on('data', (data) => { 
        const outboundEvent: StreamEvent = {id, message: data.toString()}
        eventStream.push(`data: ${JSON.stringify(outboundEvent)}\n\n`)
    })

    // Handle the promise by deleting the running script from the runningScripts object
    promise
        .catch((err) => { 
            const outboundEvent: StreamEvent = {id, message: err.message, final: true, error: true}
            eventStream.push(`data: ${JSON.stringify(outboundEvent)}\n\n`)
        })
        .finally(() => { delete runningScripts[id] })
    setResponseStatus(event, 202)
})