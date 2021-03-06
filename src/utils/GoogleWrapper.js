const { google } = require('googleapis')
const sheets = google.sheets('v4')
const gmail = google.gmail('v1')
const stream = require('stream')
const drive = google.drive('v2')
const { get, columnToLetter } = require('../utils/Utils')

const scopes = [
  'https://www.googleapis.com/auth/drive',
  'https://mail.google.com/',
  'https://www.googleapis.com/auth/spreadsheets'
]

let oauth = null

class GoogleWrapper {
  static set root(id) {
    this.rootFolderID = id
  }

  static authorise() {
    oauth = new google.auth.OAuth2(
      process.env.google_client_id,
      process.env.google_client_secret,
      'http://localhost:8081/oauthCallback'
    )
    oauth.setCredentials({
      refresh_token:
        process.env.refresh_token ||
        require('../../private.json').refresh_token
    })
  }

  static uploadFile({ encoded, mimeType, title, parent_id, convert = false }) {
    let bufferStream = new stream.PassThrough()
    bufferStream.end(Buffer.from(encoded, 'base64'))
    return new Promise((resolve, reject) => {
      const resource = {
        title
      }

      if (parent_id) resource.parents = [{ id: parent_id }]

      drive.files.insert(
        {
          auth: oauth,
          resource,
          convert,
          media: {
            mimeType,
            body: bufferStream
          }
        },
        (err, res) => {
          if (err) return console.log('The API returned an error: ' + err)
          const file = res.data
          resolve(file)
        }
      )
    })
  }

  static createFolder({ title, parent }) {
    return new Promise((resolve, reject) => {
      drive.files.insert(
        {
          auth: oauth,
          resource: {
            mimeType: 'application/vnd.google-apps.folder',
            title,
            parents: [{ id: this.rootFolderID }]
          }
        },
        (err, res) => {
          if (err) console.log('The API returned an error: ' + err)
          const file = res.data
          resolve(file)
        }
      )
    })
  }

  static getDoc({ id }) {
    this.authorise()
    return new Promise((resolve, reject) => {
      drive.files.export(
        {
          fileId: id,
          mimeType: 'text/html'
        },
        {
          responseType: 'stream'
        },
        function(err, response) {
          if (err) return reject(err)

          resolve(response.data)
        }
      )
    })
  }

  /**
   *
   * @param {String} id
   */
  static getLastRevision(id) {
    this.authorise()
    return new Promise((resolve, reject) => {
      drive.files.get(
        {
          fileId: id,
          fields: 'id, modifiedDate',
          auth: oauth
        },
        (err, res) => {
          if (err) return console.log('The API returned an error: ' + err)
          const file = res.data
          resolve(file ? file.modifiedDate : '')
        }
      )
    })
  }

  static generateNotation(sheetName, rowNumber, noColumns = 99) {
    return `${sheetName}!A${rowNumber}:${columnToLetter(noColumns)}${rowNumber}`
  }

  static getSheetsValues(id, ...sheetnames) {
    this.authorise()
    let start = new Date()
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.batchGet(
        {
          spreadsheetId: id,
          ranges: sheetnames,
          auth: oauth
        },
        (err, response) => {
          if (err) {
            console.log('The API returned an error: ' + err)
          } else {
            console.log(
              `[${id}] Fetched ${
                response.data.valueRanges.length
              } items in ${new Date().getTime() - start.getTime()}ms`
            )
            resolve(response.data.valueRanges)
          }
        }
      )
    })
  }

  static getSheetValues(id, sheetName) {
    this.authorise()
    let start = new Date()
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.get(
        {
          auth: oauth,
          spreadsheetId: id,
          range: sheetName
        },
        (err, response) => {
          if (err) {
            console.log('The API returned an error: ' + err)
          } else {
            console.log(
              `[${sheetName}] Fetched ${
                response.data.values.length
              } items in ${new Date().getTime() - start.getTime()}ms`
            )
            resolve(response.data.values)
          }
        }
      )
    })
  }

  static appendRow({ id, sheetName, row }) {
    this.authorise()
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values.append(
        {
          auth: oauth,
          spreadsheetId: id,
          range: sheetName,
          valueInputOption: 'RAW',
          insertDataOption: 'INSERT_ROWS',
          resource: {
            values: [row]
          }
        },
        (err, response) => {
          if (err) {
            console.log(err.response)
          } else {
            console.log(`Appended a row.`)
            resolve('Successfully appended rows')
          }
        }
      )
    })
  }

  static getSheetGID({ id, sheetName }) {
    this.authorise()
    return new Promise((resolve, reject) => {
      sheets.spreadsheets
        .get({
          auth: oauth,
          spreadsheetId: id
        })
        .catch(e => console.log(e))
        .then(response => {
          const sheets = get(['data', 'sheets'], response)
          if (!sheets) reject()

          const correctSheet = sheets.find(
            s => s.properties.title === sheetName
          )
          resolve(get(['properties', 'sheetId'], correctSheet))
        })
    })
  }

  static findRowByUniqueValue({ id, sheetName, uniqueValue, columnNumber }) {
    return new Promise((resolve, reject) => {
      sheets.spreadsheets.values
        .update({
          auth: oauth,
          spreadsheetId: id,
          range: '_FUNCTIONS!A1',
          valueInputOption: 'USER_ENTERED',
          includeValuesInResponse: true,
          resource: {
            range: '_FUNCTIONS!A1',
            values: [[`=MATCH("${uniqueValue}", ${sheetName}!A:A)`]]
          }
        })
        .then(response => {
          const values = get(['data', 'updatedData', 'values'], response)
          if (values[0][0] != '#N/A') resolve(values[0][0])
          else reject('Not found')
        })
    })
  }

  static removeRow({ id, sheetName, rowNumber }) {
    this.authorise()
    return new Promise((resolve, reject) => {
      this.getSheetGID({
        id,
        sheetName
      }).then(gid => {
        if (rowNumber === undefined) reject('Not found')
        //const range = this.generateNotation(sheetName, rowNumber)
        sheets.spreadsheets.batchUpdate({
          auth: oauth,
          spreadsheetId: id,
          resource: {
            requests: [
              {
                deleteDimension: {
                  range: {
                    sheetId: gid,
                    dimension: 'ROWS',
                    startIndex: rowNumber,
                    endIndex: rowNumber + 1
                  }
                }
              }
            ]
          }
        })
      })
    })
  }

  /**
   *
   * @param {Object} o
   * @param {Number} [o.rowNumber]
   */
  static updateRow({ id, sheetName, row, rowNumber }) {
    this.authorise()
    return new Promise((resolve, reject) => {
      const range = this.generateNotation(sheetName, rowNumber, row.length)
      sheets.spreadsheets.values
        .update({
          auth: oauth,
          spreadsheetId: id,
          range,
          valueInputOption: 'USER_ENTERED',
          includeValuesInResponse: true,
          resource: {
            range,
            values: [row]
          }
        })
        .then(response => {
          const values = get(['data', 'updatedData', 'values'], response)
          if (values) resolve(values[0][0])
          else reject('Not found')
        })
    })
  }

  /**
   * Encoded MimeType message
   * @param {MimeMessage} message
   */
  static sendMail(message) {
    this.authorise()
    return new Promise((resolve, reject) => {
      gmail.users.messages.send(
        {
          auth: oauth,
          userId: 'me',
          requestBody: {
            raw: message
          }
        },
        (err, response) => {
          if (err) {
            console.log(err.message)
          } else {
            resolve('Successfully sent mail')
          }
        }
      )
    })
  }
}

class GoogleSheetsWrapper {}

module.exports = GoogleWrapper
