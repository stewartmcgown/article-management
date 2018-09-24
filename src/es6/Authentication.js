import ExtendableError from './ExtendableError';
import SheetUtils from './SheetUtils';
import EmailService from './EmailService';
import AMSResponse from './AMSResponse';

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
     * @param {String} [options.baseAuthSheet="Editor Logins"] Name of the editor login sheet
     * @param {String} [options.keySheet="Article Management Keys Distributed"] Name of the key sheet
     */
    constructor(options) {
        // Options
        this.email = options.email
        this.key = options.key
        this.authToken = options.authToken
        // Databases
        this.baseAuthSheetName = options.baseAuthSheet || "Editor Logins"
        this.keySheetName = options.keySheet || "Article Management Keys Distributed"

        // States
        this.states = {
            emailIsAllowed: false,
            keyIsValid: false,
            authTokenIsValid: false
        }

        this.user = null
    
    }

    getUserFromSheet() {
        let authList = SheetUtils.getSheetAsJSON(this.baseAuthSheetName),
        user = authList.filter(o => {
            return o.email === this.email
          })

        return user
    }

    createKeyForEmail() {
        let key = Math.floor(1e5 + Math.random() * 9e5)

        // Insert key in to database
        

        return key
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
     * [Verification Path]
     * Check if a given key is expired, and if not, return
     * an authToken
     */
    verifyKey() {
        let keys = SheetUtils.getSheetAsJSON(this.keySheetName),
        entry = keys.filter(o => {
            return (o.key === this.key && o.email === this.email)
        })        
    }

    /**
     * Issue an authtoken for a user
     */
    issueAuthToken() {

    }

    /**
     * [Verification Path]
     * Check if an exchanged authtoken is still valid.
     * If not, issue a new one.
     */
    verifyAuthToken() {
        
    }

    authenticateFromSheet() {
        let user = this.getUserFromSheet()

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
        if (this.getUserFromSheet().length === 0)
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