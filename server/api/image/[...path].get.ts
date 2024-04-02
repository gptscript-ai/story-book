import { createReadStream, existsSync } from 'fs';

export default defineEventHandler(async (event) => {
    const imagePath = `stories/${getRouterParam(event, 'path')}`;    
    if (!existsSync(imagePath)) {
        throw createError({
            statusCode: 404,
            statusMessage: 'file not found'
        });
    }    

    event.node.res.setHeader('Content-Type', 'image/png'); 
    createReadStream(imagePath).pipe(event.node.res); 
    event._handled = true;
    return event;
});