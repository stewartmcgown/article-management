const fs = require('fs');
const readline = require('readline');
const {
    google
} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = 'token.json';

class API {

    async load() {
        // Load client secrets = require(a local file.
        const content = fs.readFileSync('credentials.json')
        return this.authorise(JSON.parse(content))
    }

    /**
     * Create an OAuth2 client with the given credentials, and then execute the
     * given callback function.
     * @param {Object} credentials The authorization client credentials.
     */
    async authorise(credentials) {
        const {
            client_secret,
            client_id,
            redirect_uris
        } = credentials.installed;
        this.oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);

        // Check if we have previously stored a token.
        let token;
        try {
            token = fs.readFileSync(TOKEN_PATH)
        } catch (e) {
            console.log("No token")
            token = await this.getAccessToken();
        }

        this.oAuth2Client.setCredentials(JSON.parse(token));

        listFiles(this.oAuth2Client)

    }

    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
     */
    getAccessToken() {
        const authUrl = this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });
        console.log('Authorize this app by visiting this url:', authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        return new Promise((resolve, reject) => {
            rl.question('Enter the code = require(that page here: ', (code) => {
                rl.close();
                this.oAuth2Client.getToken(code, (err, token) => {
                    if (err) return console.error('Error retrieving access token', err);
                    // Store the token to disk for later program executions
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                        if (err) console.error(err);
                        console.log('Token stored to', TOKEN_PATH);
                        resolve(token)
                    });
                });
            });
        });

    }
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
    const drive = google.drive({
        version: 'v3',
        auth
    });
    drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });
        } else {
            console.log('No files found.');
        }
    });
}

new API().load().then(x => x)