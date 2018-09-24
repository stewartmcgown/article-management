import ExtendableError from './ExtendableError';
import SheetUtils from './SheetUtils';
import EmailService from './EmailService';
import AMSResponse from './AMSResponse';
import KeyGen from './KeyGen';
import AMS from './AMS';

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

    createKeyForEmail() {
        let key = KeyGen.generate()

        // Insert key in to database
        this.pushKeyToDatabase(key)

        return key
    }

    pushKeyToDatabase(key) {
        SheetUtils.getSheetByName(this.keySheetName)
            .appendRow(AMS.createKeySheetRow({
                key: key,
                email: this.email,
                keepLoggedIn: this.keepLoggedIn
            }))
    }

    /**
     * Send an email to the user containing a log in key.
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
            payload: key
        })        

        return new AMSResponse("Successfully sent authentication email.")
    }

    /**
     * Remove key from database and null it
     */
    invalidateKey() {
        SheetUtils.removeMatchingRowsFromSheet(key)

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

        if (rows.length === 0) {
            return new NoMatchingKeyError()
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
     * Issue an authtoken for a user
     */
    issueAuthToken() {
        return {token: `token`}
    }

    /**
     * [Verification Path]
     * Check if an exchanged authtoken is still valid.
     * If not, issue a new one.
     */
    verifyAuthToken() {
        
    }

    authenticateFromSheet() {
        let user = this.getUsersFromSheet()

        if (user.length === 0)
            return new EditorNotRegisteredError()
        else {
            this.user = user[0]
            return this.sendAuthEmail()
        }
    }

    /**
     * Entry point to authentication class. Will perform necessary actions to improve 
     * security.
     * 
     * @returns 
     */
    authenticate() {
        // Check if required elements are present
        if (!this.email) {
            return new EmailNotGivenError()
        }

        // Check that email is registered before continuing
        if (this.getUsersFromSheet().length === 0)
            return new Error(EditorNotRegisteredError.name)

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

class EditorNotRegisteredError extends ExtendableError { }
class EditorHasInsufficientAccessPermissions extends ExtendableError {}
class EmailNotGivenError extends ExtendableError { }
class EmailSendFailure extends ExtendableError {}
class NoMatchingKeyError extends ExtendableError {}