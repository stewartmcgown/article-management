const AMS = require('./AMS');
const {
    get
} = require('./utils/Utils');
const Response = require('./responses/Response')
const ErrorResponse = require('./responses/ErrorResponse')
const { Authentication, AuthenticationResource, AuthenticationLevels } = require("./Authentication.js")
const url = require("url")

/**
 * A route points a path to a function and a minimum auth level
 */
class Route {
    constructor(f, auth) {
        this.f = !(f instanceof Function) || f
        this.auth = auth
    }
}


module.exports = class Router {
    /**
     * This class will be used to route requests to the appropriate function,
     * then allowing either a result or a promise to be returned.
     * 
     * Actions that require authorisation will be checked against
     * the main auth db.
     * 
     * @param {Object} request
     * @param {String} request.path
     * @param {String} request.method
     * @param {Object} request.params
     * @param {Object} request.body
     * @param {String} type is the request a Get or Post
     */
    constructor(request, type) {
        this.type = type;
        this.request = request
        this.setOptions(request)

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
                    "list": {
                        function: AMS.getAllArticles,
                        minimumAuthorisation: AuthenticationLevels.JUNIOR
                    }
                },
                "article": ["info"],
                "authentication": {
                    "authenticate": {
                        function: this.authenticate,
                        minimumAuthorisation: AuthenticationLevels.JUNIOR
                    }
                }
            },
            "POST": {
                "article": {
                    "create": {
                        function: AMS.createArticle,
                        minimumAuthorisation: AuthenticationLevels.UNAUTHORISED
                    },
                    "update": {
                        function: AMS.updateArticle,
                        minimumAuthorisation: AuthenticationLevels.JUNIOR
                    },
                    "delete": {
                        function: AMS.deleteArticle,
                        minimumAuthorisation: AuthenticationLevels.SENIOR
                    },
                    "assign": {
                        function: AMS.assignArticle,
                        minimumAuthorisation: AuthenticationLevels.SENIOR
                    }
                },
                "editor": {
                    "create": {
                        function: AMS.createEditor,
                        minimumAuthorisation: AuthenticationLevels.SENIOR
                    },
                    "update": {
                        function: AMS.updateEditor,
                        minimumAuthorisation: AuthenticationLevels.SENIOR
                    }
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
        if (!e.params)
            return

        this.email = e.params.email
        this.key = e.params.key
        this.authToken = e.params.authToken

        if (e.path)
            this.path = e.path.split("/").slice(1)
        else {
            throw new Error('No path supplied @ setOptions')
        }

        this.args = Object.assign({}, e.params, {
            email: undefined,
            key: undefined,
            authToken: undefined
        });
    }

    /**
     * @returns the first level of the two level API
     */
    get context() {
        return this.path[0];
    }

    /**
     * @returns the second level of the API
     */
    get action() {
        return this.path[1];
    }


    async route() {
        if (!this.path)
            return new Response({
                message: "AMS API v2"
            })

        const context = this.context
        const action = this.action
        const type = this.type

        // Check context is valid
        let selectedContext = get([type, context], this.allowedRoutes)
        if (!selectedContext)
            return new ErrorResponse("No such context exists.")
        else if (!(selectedContext instanceof Object))
            return new ErrorResponse("Context exists but has no actions")
        else if (!selectedContext[action])
            return new ErrorResponse(`No such action ${action} exists for context ${context}`)

        if (context == "authentication") {
            return this.authenticate()
        }

        let auth = await this.authenticate()

        // Check if user is authenticated
        if (auth.authenticationLevel == AuthenticationLevels.UNAUTHORISED || !auth.authenticationLevel) {
            return auth
        }

        let track = get([type, context, action], this.allowedRoutes)

        // verify if track and auth level match

        if (track !== null) {
            if (auth.authenticationLevel >= track.minimumAuthorisation)
                return track.function(this.request.body || this.args)
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