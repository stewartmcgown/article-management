import ExtendableError from './ExtendableError';
import SheetUtils from './SheetUtils';

/**
 * This class will handle initial authentication requests, provide authentication keys
 */
export default class Authentication {
    constructor(options) {
        // Options
        this.email = options.email
        this.key = options.key
        this.authToken = options.authToken
        
        // Databases
        this.baseAuthSheet = options.baseAuthSheet ? options.baseAuthSheet : "Editor Logins"
        this.keySheet = options.keySheet ? options.keySheet : "Article Management Keys Distributed"

        this.user = null
    
    }

    getUserFromSheet() {
        let authList = SheetUtils.getSheetAsJSON(this.baseAuthSheet),
        user = authList.filter(o => {
            return o.email === this.email
          })

        return user
    }

    /**
     * Send an email to the user containing a log in key.
     */
    sendAuthEmail() {

    }

    /**
     * Issue an authtoken for a user
     */
    issueAuthToken() {

    }

    /**
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
        if (this.getUserFromSheet.length === 0)
            return new EditorNotRegisteredError()

        // If yes, check for auth token
        if (this.authToken) {
            return this.verifyAuthToken()
        } else if (this.key) { // If we have been given a key to work with

        } else {
            return this.sendAuthEmail()
        }

        return this.authenticateFromSheet()
    }

}

class EditorNotRegisteredError extends ExtendableError {}
class EditorHasInsufficientAccessPermissions extends ExtendableError {}
class EmailNotGivenError extends ExtendableError {}