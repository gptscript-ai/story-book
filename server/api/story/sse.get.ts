import { runningScripts } from '@/server/api/story/index.post';

export default defineEventHandler(async (event) => {
    const { id } = getQuery(event);
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'prompt is required'
        });
    }

    const runningScript = runningScripts[id as string];
    if (!runningScript) {
        throw createError({
            statusCode: 404,
            statusMessage: 'running script not found'
        });
    }

    setResponseStatus(event, 200);
    setHeaders(event, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
    });

    if (runningScript.completed || runningScript.failure) {
        const message = runningScript.completed ? `done: ${runningScript.finalMessage}` : `error ${runningScript.finalMessage}`;
        event.node.res.write(`data: ${message}\n\n`);
        delete runningScripts[id as string];
        return event.node.res.end();
    }

    runningScript.stdout.on('data', (data) => event.node.res.write(`data: ${data}\n\n`));

    let stderrBuffer = '';
    runningScript.stderr.on('data', (data) => {
        stderrBuffer += data;
        if (data.includes('\n')) {
            event.node.res.write(`data: ${stderrBuffer}\n\n`);
            stderrBuffer = '';
        }
    });

    try {
        await runningScript.promise;
        delete runningScripts[id as string];
        event.node.res.write('data: done\n\n');
    } catch (error) {
        setResponseStatus(event, 500);
        event.node.res.write(`data: error: ${error}\n\n`);
    }
    event.node.res.end();
});
