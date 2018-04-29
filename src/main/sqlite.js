import * as fs from 'fs'

const DB_FILE_PATH = '/Users/akun/workspace/static/ak-tool.sqlite'

const checkDbExists = () => {
  if (fs.existsSync(DB_FILE_PATH)) {
    return false
  }

  return true
}

export const openDb = () => {
  checkDbExists()
}
