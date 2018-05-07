import fs from 'fs'

import { BaseForm } from './BaseForm'

export class DatabaseModelCodeWriteForm extends BaseForm {

  /**
   * @inheritDoc
   */
  rules () {
    return [
      [['filePath', 'className', 'language'], 'required'],
    ]
  }

  validateFilePath (attribute) {
    fs.existsSync()
  }
}