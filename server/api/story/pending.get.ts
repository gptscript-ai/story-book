import { runningScripts } from '@/server/api/story/index.post';
export default defineEventHandler(async () => {
    return Object.keys(runningScripts).map((id) => {
        // if the script is done, remove it
        if (runningScripts[id].completed) {
            delete runningScripts[id];
        }

        return {id, prompt: runningScripts[id]?.prompt}
    });
});