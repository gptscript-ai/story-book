import { useScheduler } from "#scheduler";
import path from 'path'
import fs from 'fs'

export default defineNitroPlugin(() => {
  startScheduler()
})

function startScheduler() {
  const scheduler = useScheduler();
  const libraryPath = path.join(useRuntimeConfig().storiesVolumePath,'library')

  scheduler.run(() => {
    // get the date in the format of MM-DD-YYYY
    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').join('-');
    console.log(`archiving stories for ${today}...`)

    // if the directory already exists, we don't need to do anything
    if (fs.existsSync(path.join(libraryPath,today))) {
      console.log(`archival for ${today} already complete, aborting task.`)
      return
    }

    // create the directory for today
    const todayDir = path.join(libraryPath,today)
    fs.mkdirSync(todayDir)

    // move all the stories to the new directory. Ignore the library directory since 
    // it is all of the stories that have already been archived.
    const storiesDir = useRuntimeConfig().storiesVolumePath
    fs.readdirSync(storiesDir).forEach(file => {
        if (file !== 'library') {
            fs.renameSync(path.join(storiesDir, file), path.join(todayDir, file));
        }
    })
    console.log(`archival for ${today} complete!`)
  }).cron('0 0 * * *')
}