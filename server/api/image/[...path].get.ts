import { existsSync } from 'fs';
import sharp from 'sharp';
import path from 'path';

export default defineEventHandler(async (event) => {
    const imagePath = path.join(useRuntimeConfig().storiesVolumePath, `${getRouterParam(event, 'path')}.png`);    
    if (!existsSync(imagePath)) {
        throw createError({
            statusCode: 404,
            statusMessage: 'file not found'
        });
    }    

    event.node.res.setHeader('Content-Type', 'image/jpeg'); 

    // Compress the image using sharp
    const compressedImage = await sharp(imagePath)
        .jpeg()
        .toBuffer();

    event.node.res.end(compressedImage); 
    event._handled = true;
    return event;
});
