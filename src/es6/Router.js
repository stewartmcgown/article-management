import Authentication, {
    AuthenticationLevels,
    AuthenticationResource
} from './Authentication';
import AMS, {
    Response
} from './AMS';
import Utils from './utils/Utils';
import SheetUtils from './utils/SheetUtils';

/**
 * A route points a path to a function and a minimum auth level
 */
class Route {
    constructor(f, auth) {
        this.f = !(f instanceof Function) || f
        this.auth = auth
    }
}

/**
 * This class will be used to route requests to the appropriate function,
 * then allowing either a result or a promise to be returned.
 * 
 * Actions that require authorisation will be checked against
 * the main auth db.
 * 
 * @param {request} e
 * @param {String} type is the request a Get or Post
 */
export class Router {
    constructor(e, type) {
        this.type = type;

        this.post = {}
        this.setOptions(e)

        if (this.type == "POST")
            this.setPostData(e)

        // Instantiate the interface
        this.ams = new AMS()
    }

    /**
     * Find the routes that can be taken by the application.
     * 
     * Each route has a level attached to it, indicating the minimum authorisation
     * required to get access.
     */
    get allowedRoutes() {
        return {
            "GET": {
                "articles": {
                    "list": { function: AMS.getAllArticles, minimumAuthorisation: AuthenticationLevels.JUNIOR }
                },
                "article": ["info"],
                "authentication": {
                    "authenticate": { function: this.authenticate, minimumAuthorisation: AuthenticationLevels.JUNIOR }
                }
            },
            "POST": {
                "article": {
                    "create": { function: AMS.createArticle, minimumAuthorisation: AuthenticationLevels.UNAUTHORISED },
                    "update": { function: AMS.updateArticle, minimumAuthorisation: AuthenticationLevels.JUNIOR },
                    "delete": { function: AMS.deleteArticle, minimumAuthorisation: AuthenticationLevels.SENIOR },
                    "assign": { function: AMS.assignArticle, minimumAuthorisation: AuthenticationLevels.SENIOR }
                },
                "editor": {
                    "create": { function: AMS.createEditor, minimumAuthorisation: AuthenticationLevels.SENIOR },
                    "update": { function: AMS.updateEditor, minimumAuthorisation: AuthenticationLevels.SENIOR }
                }
            }
        }
    }

    /**
     * Applies the POST request data to the router
     * 
     * @param {Object} e
     * @param {String} e.postData 
     */
    setPostData(e) {
        if (!e.postData)
            return
        this.post = {
            type: e.postData.type,
            contents: JSON.parse(e.postData.contents)
        }

    }

    /**
     * Applies the parameter options to the router.
     * 
     * @param {Object} e the request
     * @param {Object} e.parameter request parameters
     * @param {String} e.parameter.email a supplied email
     * @param {String} e.parameter.authToken a supplied authToken
     * @param {String} e.parameter.path alternative to supplying an actual path to the API.
     *                                  if there is no real path specified this will be used
     */
    setOptions(e) {
        if (!e.parameter)
            return

        this.email = e.parameter.email
        this.key = e.parameter.key
        this.authToken = e.parameter.authToken

        let pathInfo = Utils.get(['pathInfo'], e)
        if (pathInfo)
            this.paths = pathInfo.split('/')
        else if (e.parameter.path) {
            this.paths = e.parameter.path.split('/')
        } else {
            throw new Error('No path supplied @ setOptions')
        }

        this.args = Object.assign({}, e.parameter, {
            email: undefined,
            key: undefined,
            authToken: undefined
        });
    }

    /**
     * @returns the first level of the two level API
     */
    get context() {
        return this.paths[0];
    }

    /**
     * @returns the second level of the API
     */
    get action() {
        return this.paths[1];
    }


    route() {
        if (!this.paths)
            return {}

        const context = this.context
        const action = this.action
        const type = this.type

        // Check context is valid
        let selectedContext = Utils.get([type, context], this.allowedRoutes)
        if (!selectedContext)
            throw new Error("No such context exists.")
        else if (!(selectedContext instanceof Object))
            throw new Error("Conext exists but has no actions")
        else if (!selectedContext[action])
            throw new Error(`No such action ${action} exists for context ${context}`)

        if (context == "authentication") {
            return this.authenticate()
        }

        let auth = this.authenticate()

        // Check if user is authenticated
        if (auth.authenticationLevel == AuthenticationLevels.UNAUTHORISED || !auth.authenticationLevel) {
            return new AuthenticationResource({
                message: "Unauthorised",
                authenticationLevel: AuthenticationLevels.UNAUTHORISED
            })
        }

        let track = Utils.get([type, context, action], this.allowedRoutes)

        // verify if track and auth level match

        if (track !== null) {
            if (auth.authenticationLevel >= track.minimumAuthorisation)
                return track.function(this.post.contents || this.args)
            else
                return new Response({
                    message: "You are not authorised to perform that action"
                })
        } else {
            return new Response({
                message: "Unable to locate an appropriate track."
            })
        }

    }

    /**
     * Checks whether a user is authenticated
     * @return {AuthenticationResource} an authentication object
     */
    authenticate() {
        this.auth = new Authentication({
            email: this.email,
            key: this.key,
            authToken: this.authToken
        })

        return this.auth.authenticate()
    }
}