const AMS = require('./AMS');
const {
    get
} = require('./utils/Utils');
const Response = require('./responses/Response')
const ErrorResponse = require('./responses/ErrorResponse')
const Errors = require('./Errors.js')
const {
    Authentication,
    AuthenticationResource,
    AuthenticationLevels
} = require("./Authentication.js")
const url = require("url")
const Logger = require("./Logger")

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
                    },
                    "get": {
                        function: AMS.getArticle,
                        minimumAuthorisation: AuthenticationLevels.JUNIOR
                    }
                },
                "authentication": {
                    "authenticate": {
                        function: this.authenticate,
                        minimumAuthorisation: AuthenticationLevels.JUNIOR
                    }
                },
                "editors": {
                    "list": {
                        function: AMS.getAllEditors,
                        minimumAuthorisation: AuthenticationLevels.JUNIOR
                    }
                },
                "authors": {
                    "list": {
                        function: AMS.getAllAuthors,
                        minimumAuthorisation: AuthenticationLevels.JUNIOR
                    },
                    "get": {
                        function: AMS.getEditor,
                        minimumAuthorisation: AuthenticationLevels.JUNIOR
                    }
                },
                "states": {
                    "list": {
                        function: AMS.getAllStates,
                        minimumAuthorisation: AuthenticationLevels.JUNIOR
                    }
                }
            },
            "POST": {
                "articles": {
                    "create": {
                        function: AMS.createArticle,
                        minimumAuthorisation: AuthenticationLevels.UNAUTHORISED
                    },
                    "update": {
                        function: AMS.updateArticle,
                        minimumAuthorisation: AuthenticationLevels.SENIOR
                    },
                    "delete": {
                        function: AMS.deleteArticle,
                        minimumAuthorisation: AuthenticationLevels.SENIOR
                    },
                    "assign": {
                        function: AMS.assignArticle,
                        minimumAuthorisation: AuthenticationLevels.SENIOR
                    },
                    "status": {
                        function: AMS.changeStatusArticle,
                        minimumAuthorisation: AuthenticationLevels.JUNIOR
                    }
                },
                "editors": {
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

        this.email = e.params.email ? e.params.email.toLowerCase() : null
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
        this.params = e.params
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


    /**
     * Handle the routing of a request
     * 
     * @returns 
     */
    async route() {
        if (!this.path)
            return new Response({
                message: "AMS API v2"
            })

        Authentication.cleanUp()

        const context = this.context
        const action = this.action
        const type = this.type

        // Check context is valid
        let selectedContext = get([type, context], this.allowedRoutes)
        if (!selectedContext) {
            Logger.log(`${context}/${action}`, this.email, Errors.NO_SUCH_CONTEXT)
            return new ErrorResponse(Errors.NO_SUCH_CONTEXT)
        } else if (!(selectedContext instanceof Object)) {
            Logger.log(`${context}/${action}`, this.email, Errors.CONTEXT_NO_ACTIONS)
            return new ErrorResponse(Errors.CONTEXT_NO_ACTIONS)

        } else if (!selectedContext[action]) {
            return new ErrorResponse(`No such action ${action} exists for context ${context}`)
        }

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
            if (!track.function) {
                return new ErrorResponse(Errors.INTERNAL_ERROR)
            }
            if (auth.authenticationLevel >= track.minimumAuthorisation) {

                try {
                    return track.function({
                        data: this.request.body,
                        params: this.params,
                        level: auth.authenticationLevel,
                        user: auth.user
                    })
                } catch (e) {
                    return new ErrorResponse(Errors.INTERNAL_ERROR)
                }
            } else
                return new ErrorResponse(Errors.UNAUTHORISED_ACCESS)
        } else {
            return new ErrorResponse(Errors.INTERNAL_ERROR)
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