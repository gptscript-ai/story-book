import fs from 'fs'

export default defineEventHandler(async (event) => {
    try {
        let name = getRouterParam(event, 'name')
        if (!name) {
            throw createError({
                statusCode: 400,
                statusMessage: 'name is required'
            });
        }

        name = decodeURIComponent(name);

        const path = useRuntimeConfig().storiesVolumePath
        await fs.promises.readdir(`${path}/${name}`)
        fs.promises.rm(`${path}/${name}`, { recursive: true })
    } catch (error) {
        // if the error is a 404 error, we can throw it directly
        if ((error as any).code === 'ENOENT') {
            throw createError({
                statusCode:    404,
                statusMessage: 'story not found',
            })
        }
        throw createError({
            statusCode:    500,
            statusMessage: `error removing story: ${error}`,
        })
    }
})