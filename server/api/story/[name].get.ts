import fs from 'fs'
import path from 'path';
import type { Pages } from '@/lib/types';

export default defineEventHandler(async (event) => {
    try {
        let name = getRouterParam(event, 'name');
        if (!name) {
            throw createError({
                statusCode: 400,
                statusMessage: 'name is required'
            });
        }

        name = decodeURIComponent(name);

        const storiesVolumePath = useRuntimeConfig().storiesVolumePath
        const files = await fs.promises.readdir(path.join(storiesVolumePath, name));
        const pages: Pages = {};
        for (const file of files) {
            if (!file.endsWith('.txt')) continue
            const page = await fs.promises.readFile(path.join(storiesVolumePath, name, file), 'utf-8');
            pages[file.replace('.txt', '').replace('page', '')] = {
                image_path: `/api/image/${path.join(name, file.replace('.txt', ''))}`,
                content: page
            }
        }

        return pages
    } catch (error) {
        // if the error is a 404 error, we can throw it directly
        if ((error as any).code === 'ENOENT') {
            throw createError({
                statusCode:    404,
                statusMessage: 'story found',
            })
        }
        throw createError({
            statusCode:    500,
            statusMessage: `error fetching story: ${error}`,
        })
    }
})