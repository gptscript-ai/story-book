import fs from 'fs'

export default defineEventHandler(async (event) => {
    try {
        return await fs.promises.readdir(useRuntimeConfig().storiesVolumePath+ '/library')
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