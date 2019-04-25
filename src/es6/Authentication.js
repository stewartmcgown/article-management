const ExtendableError = require('./utils/ExtendableError');
const ErrorResponse = require("./responses/ErrorResponse")
const Errors = require('./Errors.js')
const SheetUtils = require('./utils/SheetUtils');
const EmailService = require('./emails/EmailService');
const AMS = require('./AMS');
const AMSCrypto = require('../crypto/AMSCrypto')
const {
    get
} = require('./utils/Utils');
const Person = require("./people/Person")
const Editor = require("./people/Editor")
const Editors = require("./Editors")
const Logger = require("./Logger")

const AuthenticationLevels = Object.freeze({
    UNAUTHORISED: 0,
    JUNIOR: 1,
    SENIOR: 2,
    ADMIN: 3
})

const StaleTimes = Object.freeze({
    KEY: 60,
    AUTHTOKEN: 60
})

class Key {
    constructor(key, level) {
        this.key = key
        this.level = level
    }
}

/**
 * This class will handle initial authentication requests, provide authentication keys
 */
class Authentication {

    /**
     * Build the Authentication object
     * 
     * @param {Object} options
     * @param {String} options.email The email to authenticate
     * @param {Integer} options.key Authentication key = require(an email
     * @param {String} options.authToken Exisiting authtoken = require(a previous run
     * @param {Boolean} [options.keepLoggedIn=false] Should the key be issued for a longer period
     * @param {String} [options.baseAuthSheet="Editor Logins"] Name of the editor login sheet
     * @param {String} [options.keySheet="Article Management Keys Distributed"] Name of the key sheet
     */
    constructor(options) {
        // Options
        this.email = options.email
        this.key = options.key || null
        this.authToken = options.authToken || null
        this.keepLoggedIn = options.keepLoggedIn || false

        // Databases
        this.baseAuthSheetName = options.baseAuthSheet || AMS.baseAuthSheet
        this.keySheetName = options.keySheet || AMS.keySheet
        this.authTokenSheetName = options.authTokenSheet || AMS.authTokenSheet

        // States
        this.states = {
            emailIsAllowed: false,
            keyIsValid: false,
            authTokenIsValid: false
        }

        this.user = null

    }

    /**
     * Get users 
     * 
     * @returns {Array<Object>}
     */
    async getUsersFromSheet() {
        let matchingUsers = await SheetUtils.getMatchingRowsFromSheet(this.baseAuthSheetName, {
            email: this.email
        })

        return matchingUsers

    }

    /**
     * @return {Key}
     */
    createKeyForEmail() {
        let keyNumber = AMSCrypto.generateKey(6)

        let key = new Key(keyNumber, this.level)

        // Insert key in to database
        this.pushKeyToDatabase(key)

        return key
    }

    /**
     * 
     * @param {Key} key key object
     * @param {Number} key.key key number
     * @param {AuthenticationLevels} key.level
     */
    async pushKeyToDatabase(key) {
        SheetUtils.pushRowToSheet(
            this.createKeySheetRow({
                key: key.key,
                email: this.email,
                level: key.level,
                keepLoggedIn: this.keepLoggedIn
            }), this.keySheetName)

    }

    /**
     * 
     * @param {AMS.Token} token Token object
     * @param {String} token.token token string
     * @param {AuthenticationLevels} token.level level of authorisation
     */
    async pushAuthTokenToDatabase(token) {
        SheetUtils.pushRowToSheet(
            this.createAuthTokenSheetRow({
                token: token.token,
                email: this.email,
                level: token.level,
                keepLoggedIn: this.keepLoggedIn
            }), AMS.authTokenSheet)
    }

    /**
     * Send an authentication email to the user
     * 
     * @return {AuthenticationResource} the current authentication state
     */
    async sendAuthEmail() {
        // Check state
        if (!this.states.emailIsAllowed)
            return new EmailSendFailure()

        // Generate key
        let key = this.createKeyForEmail()

        EmailService.send({
            to: this.email,
            type: 'key',
            key: key.key
        })

        return new AuthenticationResource({
            message: "Successfully sent authentication email.",
            email: this.email,
        })
    }

    /**
     * Remove key = require(database and null it
     */
    async invalidateKey() {
        SheetUtils.removeMatchingRowFromSheet(AMS.keySheet, {
            email: this.email,
            key: this.key
        })
    }

    /**
     * [Verification Path]
     * Check if a given key is expired, and if not, return
     * an authToken
     */
    async verifyKey() {
        let rows = await SheetUtils.getMatchingRowsFromSheet(AMS.keySheet, {
            email: this.email,
            key: this.key
        })

        if (rows.length === 0 || !rows[0]) {
            return new AuthenticationResource({
                message: "No matching key found."
            })
        }

        let keyEntry = rows[0]

        // Check date isn't older than an hour
        if (Authentication.isKeyStale(keyEntry.dateTime)) {
            // Date is too old

            // Invalidate key
            this.invalidateKey()

            return new AuthenticationResource({
                message: "No matching key found"
            })
        } else {
            this.invalidateKey()
            return this.issueAuthToken(this.user)
        }

    }

    /**
     * 
     * @param {String} level 
     */
    async setLevel(level) {
        level = level.toUpperCase()
        if (AuthenticationLevels[level]) {
            this.level = AuthenticationLevels[level]
        } else {
            this.level = AuthenticationLevels.UNAUTHORISED
        }
    }

    /**
     * Creates an array for appending to a key sheet. Usually called
     * by Authentication classes
     * 
     * @param {Object} data to create row from
     * @param {String} data.key the generated key
     * @param {String} data.email the email tied to the key
     * @param {AuthenticationLevels} [data.level] the level of auth
     * @param {Boolean} [data.keepLoggedIn=false] should the token last for longer than usual
     * 
     * @returns {Array} key sheet row 
     *  [DateTime, data.email, data.key, data.keepLoggedIn]
     */
    createKeySheetRow(data) {
        if (!data.key) throw new Error(`Missing Key @ ${this.createKeySheetRow.name}`)
        if (!data.email) throw new Error(`Missing Email @ ${this.createKeySheetRow.name}`)

        data.keepLoggedIn = data.keepLoggedIn || false
        data.level = data.level || AuthenticationLevels.UNAUTHORISED

        return [
            new Date(),
            data.email,
            data.key,
            data.level,
            data.keepLoggedIn
        ]
    }

    /**
     * Issue an authtoken for a user
     * 
     * @returns an authentication resource
     */
    async issueAuthToken(user) {
        let tokenString = AMSCrypto.generateRandomString(40)

        this.pushAuthTokenToDatabase({
            token: tokenString,
            level: this.level
        })

        return AuthenticationResource.authTokenResponse({
            authToken: tokenString,
            user,
            authenticationLevel: this.level
        })
    }

    /**
     * [Verification Path]
     * Check if an exchanged authtoken is still valid.
     * If not, issue a new one.
     */
    async verifyAuthToken() {
        let rows = await SheetUtils.getMatchingRowsFromSheet(AMS.authTokenSheet, {
            token: this.authToken
        })

        if (rows.length === 0 || !get(['0', 'dateTime'], rows)) {
            Logger.unauthorised("Authentication", this.email)
            return new ErrorResponse(Errors.EXPIRED_AUTH_TOKEN)
        }

        let authTokenEntry = rows[0]

        // Check date isn't older than an hour
        if (Authentication.isAuthTokenStale(authTokenEntry.dateTime)) {
            // Date is too old, so Invalidate key
            this.invalidateAuthToken()
            Logger.unauthorised("Authentication", this.email)
            return new ErrorResponse(Errors.EXPIRED_AUTH_TOKEN)
        } else {
            const user = await Editors.getEditorByEmail(authTokenEntry.email)
            // Date is in range
            Logger.log("Authentication", user.email, "Success")
            return new AuthenticationResource({
                message: "Successfully authenticated",
                authenticationLevel: authTokenEntry.level,
                email: authTokenEntry.email,
                user
            })
        }
    }

    async invalidateAuthToken() {
        SheetUtils.removeMatchingRowFromSheet(AMS.authTokenSheet, {
            token: this.authToken
        })
    }


    createAuthTokenSheetRow(data) {
        if (!data.token || !data.email) throw new Error(`Missing data @ ${this.createAuthTokenSheetRow.name}`)

        data.keepLoggedIn = data.keepLoggedIn || false

        return [
            new Date(),
            data.email,
            data.token,
            data.level,
            data.keepLoggedIn
        ]
    }

    async getUserPermissions() {

    }

    /**
     * Entry point to authentication class. Will perform necessary actions to improve 
     * security.
     * 
     * @returns 
     */
    async authenticate() {
        // Check if required elements are present
        if (!this.email && !this.authToken) {
            return new EmailNotGivenError()
        }

        // Check that email is registered before continuing
        if (!this.authToken && this.email) {
            let matchingUsers = await this.getUsersFromSheet()
            if (!matchingUsers.length) {
                return new ErrorResponse(Errors.EDITOR_NOT_FOUND)
            } else {
                this.user = matchingUsers[0]
                this.setLevel(this.user.level)
            }
        }

        // Set state
        this.states.emailIsAllowed = true

        // If yes, check for auth token
        if (this.authToken) {
            return await this.verifyAuthToken()
        } else if (this.key) {
            // If we have been given a key to work with, we should 
            return await this.verifyKey()
        } else {
            // If we have neither of these, send an authentication email
            return await this.sendAuthEmail()
        }
    }

    /**
     * Remove stale keys
     */
    static async cleanUp() {
        const data = await SheetUtils.getSheetAsJSON(AMS.keySheet)

        data.forEach(k => {
            if(Authentication.isKeyStale(k.dateTime)) {
                SheetUtils.removeMatchingRowFromSheet(AMS.keySheet, k)
            }
        })
    }

    /**
     * 
     * @param {String} dateTime
     */
    static isKeyStale(dateTime) {
        return (new Date().getTime() - new Date(dateTime).getTime()) > (StaleTimes.KEY * 60 * 1000)
    }

    static isAuthTokenStale(dateTime) {
        return (new Date().getTime() - new Date(dateTime).getTime()) > (StaleTimes.AUTHTOKEN * 60 * 1000)
    }
}

class AuthenticationResource {
    /**
     * Constructs an authentication resource
     * 
     * @param {Object} data 
     * @param {String} data.message
     * @param {Person} [data.editor]
     * @param {Integer} [data.authenticationLevel=AuthenticationLevels.UNAUTHORISED]
     * @param {String} data.email
     */
    constructor(data) {
        this.message = data.message || null
        this.authenticationLevel = data.authenticationLevel || AuthenticationLevels.UNAUTHORISED
        this.email = data.email || null

        this.authToken = data.authToken || null
        this.user = data.user
    }

    static authTokenResponse({ authToken, authenticationLevel, user}) {
        return new AuthenticationResource({
            message: "Issued authtoken for user",
            authToken,
            authenticationLevel,
            user
        })
    }
}

module.exports = {
    Authentication,
    AuthenticationLevels,
    AuthenticationResource
}

class EditorNotRegisteredError extends ExtendableError {}
class EditorHasInsufficientAccessPermissions extends ExtendableError {}
class EmailNotGivenError extends ExtendableError {}
class EmailSendFailure extends ExtendableError {}
class NoMatchingKeyError extends ExtendableError {}