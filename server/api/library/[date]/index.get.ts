import fs from 'fs'
import path from 'path';

export default defineEventHandler(async (event) => {
    let date = getRouterParam(event, 'date');
    if (!date) {
        throw createError({
            statusCode: 400,
            statusMessage: 'date is required'
        });
    }

    try {
        return await fs.promises.readdir(path.join(useRuntimeConfig().storiesVolumePath, 'library', date))
    } catch (error) {
        // if the error is a 404 error, we can throw it directly
        if ((error as any).code === 'ENOENT') {
            throw createError({
                statusCode:    404,
                statusMessage: 'no stories found',
            })
        }
        throw createError({
            statusCode:    500,
            statusMessage: `error fetching stories: ${error}`,
        })
    }
})