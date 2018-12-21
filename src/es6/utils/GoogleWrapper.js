const {
    google
} = require('googleapis')
const privateKey = require("../../../private.json")
const sheets = google.sheets('v4')

class GoogleWrapper {

    constructor() {
        this.authorise()
    }

    authorise() {
        // configure a JWT auth client
        this._jwt = new google.auth.JWT(
            privateKey.client_email,
            null,
            privateKey.private_key,
            ['https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive',
            ]);
        //authenticate request
        this._jwt.authorize(function (err, tokens) {
            if (err) {
                console.log(err);
                return;
            } else {
                console.log("Successfully connected!");
            }
        });
    }

    getSheetValues(id, sheetName) {
        return new Promise((resolve, reject) => {
                sheets.spreadsheets.values.get({
                    auth: this._jwt,
                    spreadsheetId: id,
                    range: sheetName
                }, (err, response) => {
                    if (err) {
                        console.log('The API returned an error: ' + err);
                    } else {
                        resolve(response.values)
                    }
                });
            })
        }
    }


    module.exports = GoogleWrapper