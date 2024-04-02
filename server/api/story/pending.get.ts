import { runningScripts } from '@/server/api/story/index.post';
export default defineEventHandler(async () => {
    Object.keys(runningScripts).forEach((key) => {
        // if the script is done, remove it
        if (runningScripts[key].completed) {
            delete runningScripts[key];
        }
    });

    return Object.keys(runningScripts);
});