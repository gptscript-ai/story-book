import { runningScripts } from '@/server/api/story/index.post';
export default defineEventHandler(async () => { return runningScripts });