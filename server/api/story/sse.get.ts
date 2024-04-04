import { eventStream } from '@/server/api/story/index.post';

export default defineEventHandler(async (event) => {
    setResponseStatus(event, 200);
    setHeaders(event, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
        'Connection': 'keep-alive',
        'Content-Type': 'text/event-stream',
    });
    
    event._handled = true;
    eventStream.on('data', (data) => event.node.res.write(data));
});
