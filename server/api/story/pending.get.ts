import { runningScripts } from '@/server/api/story/index.post';
export default defineEventHandler(async () => {
    return Object.keys(runningScripts).map((id) => {
        return {id, prompt: runningScripts[id]?.prompt}
    });
});