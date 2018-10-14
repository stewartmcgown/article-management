import ExtendableError from './ExtendableError';
import SheetUtils from './SheetUtils';
import EmailService from './EmailService';
import AMS from './AMS';
import AMSCrypto from '../crypto/AMSCrypto';
import Utils from './Utils';

export const AuthenticationLevels = Object.freeze({
    UNAUTHORISED: 0,
    JUNIOR: 1,
    SENIOR: 2,
    ADMIN: 3
})

/**
 * This class will handle initial authentication requests, provide authentication keys
 */
export default class Authentication {

    /**
     * Build the Authentication object
     * 
     * @param {Object} options
     * @param {String} options.email The email to authenticate
     * @param {Integer} options.key Authentication key from an email
     * @param {String} options.authToken Exisiting authtoken from a previous run
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
     * Get users from a Google Sheet
     * 
     * @returns {Array<Object>}
     */
    getUsersFromSheet() {
        let matchingUsers = SheetUtils.getMatchingRowsFromSheet(this.baseAuthSheetName, {
            email: this.email
        })

        return matchingUsers

    }

    /**
     * @return {Key}
     */
    createKeyForEmail() {
        let keyNumber = AMSCrypto.generateKey(6)

        let key = {
            key: keyNumber,
            level: this.level
        }

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
    pushKeyToDatabase(key) {
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
    pushAuthTokenToDatabase(token) {
        SheetUtils.pushRowToSheet(
            this.createAuthTokenSheetRow({
                token: token.token,
                email: this.email,
                level: token.level,
                keepLoggedIn: this.keepLoggedIn
            }), this.authTokenSheetName)
    }

    /**
     * Send an authentication email to the user
     * 
     * @return {AuthenticationResource} the current authentication state
     */
    sendAuthEmail() {
        // Check state
        if (!this.states.emailIsAllowed)
            return new EmailSendFailure()

        // Generate key
        let key = this.createKeyForEmail()

        EmailService.send({
            to: this.email,
            type: 'key',
            payload: key.key
        })

        return new AuthenticationResource({
            message: "Successfully sent authentication email.",
            email: this.email
        })
    }

    /**
     * Remove key from database and null it
     */
    invalidateKey() {
        SheetUtils.removeMatchingRowsFromSheet(this.key)

        this.key = null
    }

    /**
     * [Verification Path]
     * Check if a given key is expired, and if not, return
     * an authToken
     */
    verifyKey() {
        let rows = SheetUtils.getMatchingRowsFromSheet(this.keySheetName, {
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
        if ((new Date().getTime() - new Date(keyEntry.dateTime).getTime()) > (60 * 60 * 1000)) {
            // Date is too old

            // Invalidate key
            this.invalidateKey()

            return this.authenticate()
        } else {
            // Date is in range
            return this.issueAuthToken()
        }

    }

    /**
     * 
     * @param {String} level 
     */
    setLevel(level) {
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
    issueAuthToken() {
        let tokenString = AMSCrypto.generateRandomString(40)

        this.pushAuthTokenToDatabase({
            token: tokenString,
            level: this.level
        })

        return new AuthenticationResource({
            message: "Issued authtoken for user",
            authToken: tokenString,
            authenticationLevel: this.level
        })
    }

    /**
     * [Verification Path]
     * Check if an exchanged authtoken is still valid.
     * If not, issue a new one.
     */
    verifyAuthToken() {
        let rows = SheetUtils.getMatchingRowsFromSheet(this.authTokenSheetName, {
            token: this.authToken
        })

        if (rows.length === 0 || !Utils.get(['0', 'dateTime'], rows)) {
            return new AuthenticationResource({
                message: "Authtoken not present.",
            })
        }

        let authTokenEntry = rows[0]

        // Check date isn't older than an hour
        if ((new Date().getTime() - new Date(authTokenEntry.dateTime).getTime()) > (60 * 60 * 1000)) {
            // Date is too old, so Invalidate key
            this.invalidateAuthToken()

            return new AuthenticationResource({
                message: "Authtoken has expired",
            })
        } else {
            // Date is in range
            return new AuthenticationResource({
                message: "Successfully authenticated",
                authenticationLevel: authTokenEntry.level,
                email: authTokenEntry.email
            })
        }
    }

    invalidateAuthToken() {
        SheetUtils.removeMatchingRowsFromSheet(this.authToken)

        this.authToken = null
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

    getUserPermissions() {

    }

    /**
     * Entry point to authentication class. Will perform necessary actions to improve 
     * security.
     * 
     * @returns 
     */
    authenticate() {
        // Check if required elements are present
        if (!this.email && !this.authToken) {
            return new EmailNotGivenError()
        }

        // Check that email is registered before continuing
        if (!this.authToken) {
            let matchingUsers = this.getUsersFromSheet()
            if (matchingUsers.length === 0) {
                throw new EditorNotRegisteredError()
            } else {
                this.user = matchingUsers[0]
                this.setLevel(this.user.level)
            }
        }

        // Set state
        this.states.emailIsAllowed = true

        // If yes, check for auth token
        if (this.authToken) {
            return this.verifyAuthToken()
        } else if (this.key) {
            // If we have been given a key to work with, we should 
            return this.verifyKey()
        } else {
            // If we have neither of these, send an authentication email
            return this.sendAuthEmail()
        }
    }

}

export class AuthenticationResource {
    /**
     * Constructs an authentication resource
     * 
     * @param {Object} data 
     * @param {String} data.message
     * @param {Integer} [data.authenticationLevel=AuthenticationLevels.UNAUTHORISED]
     * @param {String} data.email
     */
    constructor(data) {
        this.message = data.message || null
        this.authenticationLevel = data.authenticationLevel || AuthenticationLevels.UNAUTHORISED
        this.email = data.email || null

        this.key = data.key || null
        this.authToken = data.authToken || null

    }
}


class EditorNotRegisteredError extends ExtendableError { }
class EditorHasInsufficientAccessPermissions extends ExtendableError { }
class EmailNotGivenError extends ExtendableError { }
class EmailSendFailure extends ExtendableError { }
class NoMatchingKeyError extends ExtendableError { }