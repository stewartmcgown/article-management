const {
    google
} = require('googleapis')
const privateKey = require("../../../private.json")
const sheets = google.sheets('v4')
const gmail = google.gmail("v1")
const {
    get,
    columnToLetter
} = require("../utils/Utils")

const scopes = [
    'https://www.googleapis.com/auth/drive',
    "https://mail.google.com/",
    "https://www.googleapis.com/auth/spreadsheets"
]

let oauth = null

class GoogleWrapper {
    static authorise() {
        // configure a JWT auth client
        oauth = new google.auth.OAuth2("173181351763-e0i3cevf5l6p0rf0phtoibtgibuc724q.apps.googleusercontent.com", "8A7Dqz1S3gcfXJhRRRJzucsF", "http://localhost:8081/oauthCallback")
        //authenticate request
        oauth.setCredentials({
            refresh_token: privateKey.refresh_token
        })
    }

    static getSheetValues(id, sheetName) {
        this.authorise()
        let start = new Date()
        return new Promise((resolve, reject) => {
            sheets.spreadsheets.values.get({
                auth: oauth,
                spreadsheetId: id,
                range: sheetName
            }, (err, response) => {
                if (err) {
                    console.log('The API returned an error: ' + err);
                } else {
                    console.log(`Fetched ${response.data.values.length} items in ${new Date().getTime() - start.getTime()}ms`)
                    resolve(response.data.values)
                }
            });
        })
    }

    static appendRow({
        id,
        sheetName,
        row
    }) {
        this.authorise()
        return new Promise((resolve, reject) => {
            sheets.spreadsheets.values.append({
                auth: oauth,
                spreadsheetId: id,
                range: sheetName,
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                resource: {
                    values: [
                        row
                    ],
                }
            }, (err, response) => {
                if (err) {
                    console.log(err.response.data)
                } else {
                    console.log(`Appended a row.`)
                    resolve("Successfully appended rows")
                }
            })
        })
    }

    static findRowByUniqueValue({
        id,
        sheetName,
        uniqueValue
    }) {
        return new Promise((resolve, reject) => {
            sheets.spreadsheets.values.update({
                auth: oauth,
                spreadsheetId: id,
                range: "_FUNCTIONS!A1",
                valueInputOption: "USER_ENTERED",
                includeValuesInResponse: true,
                resource: {
                    range: "_FUNCTIONS!A1",
                    values: [
                        [
                            `=MATCH("${uniqueValue}", ${sheetName}!I:I, 0)`
                        ]
                    ]
                }
            }).then((response) => {
                const values = get(["data", "updatedData", "values"], response)
                if (values) resolve(values[0][0])
                else reject("Not found")
            })
        })
    }

    /**
     * 
     * @param {Object} o
     * @param {Number} [o.rowNumber]
     */
    static updateRow({
        id,
        sheetName,
        uniqueValue,
        row
    }) {
        this.authorise()
        return new Promise((resolve, reject) => {
            this.findRowByUniqueValue({
                id,
                sheetName,
                uniqueValue
            }).catch(e => "Failed")
            .then(rowNumber => {
                const range = `${sheetName}!A${rowNumber}:${columnToLetter(row.length)}${rowNumber}`
                sheets.spreadsheets.values.update({
                    auth: oauth,
                    spreadsheetId: id,
                    range,
                    valueInputOption: "USER_ENTERED",
                    includeValuesInResponse: true,
                    resource: {
                        range,
                        values: [
                            row
                        ]
                    }
                }).then((response) => {
                    const values = get(["data", "updatedData", "values"], response)
                    if (values) resolve(values[0][0])
                    else reject("Not found")
                })
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
            gmail.users.messages.send({
                auth: oauth,
                userId: "me",
                requestBody: {
                    raw: message
                }
            }, (err, response) => {

                if (err) {
                    console.log(err.message)
                } else {
                    resolve("Successfully sent mail")
                }
            })
        })
    }
}

class GoogleSheetsWrapper {

}

module.exports = GoogleWrapper