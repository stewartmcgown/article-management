import Authentication from './Authentication';
import AMS from './AMS';

/**
 * Safely access nested object properties
 * 
 * @param {Array<Object>} p path to desired object
 * @param {Object} o context object in which to search 
 * 
 * @returns the desired object or null if no such object is found.
 * 
 * @author A. Sharif
 * @see https://medium.com/javascript-inside/safely-accessing-deeply-nested-values-in-javascript-99bf72a0855a
 */
const get = (p, o) =>
    p.reduce((xs, x) =>
        (xs && xs[x]) ? xs[x] : null, o)

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

        this.setOptions(e)

        // Instantiate the interface
        this.ams = new AMS()
    }

    get allowedRoutes() {
        return AMS.allowedRoutes
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

        let pathInfo = get(['pathInfo'], e)
        if (pathInfo)
            this.paths = pathInfo.split('/')
        else if (e.parameter.path) {
            this.paths = e.parameter.path.split('/')
        } else {
            return new Error('No path supplied @ setOptions')
        }
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

    /**
     * Process a GET request
     * @returns the requested data, or Unauthorised
     */
    routeGET() {
        const context = this.context;
        const action = this.action;

        // Check context is valid
        let selectedContext = get([this.type, context], this.allowedRoutes)
        if (!selectedContext)
            throw new Error("No such context exists.")
        else if (!(selectedContext instanceof Array))
            throw new Error("Conext exists but has no actions")
        else if (!selectedContext.includes(action))
            throw new Error(`No such action exists for context ${context}`)

        if (context == "authentication") {
            return this.authenticate()
        }

        // AUTHENTICATED TRACKS
        if (context == "articles")
            if (action == "list")
                return this.ams.getList();
        else if (context == "article")
            if (action == "info")
                return this.ams.getInfo();
        
    }

    /**
     * Process a POST request
     * @returns the requested data, or Unauthorised
     */
    routePOST() {

    }

    route() {
        if (!this.paths)
            return {}

        switch (this.type) {
            case "GET":
                return this.routeGET()
                break
            case "POST":
                return this.routePOST()
                break
        }
    }

    /**
     * Checks whet
     * @returns an authentication object
     */
    authenticate() {
        let auth = new Authentication({
            email: this.email,
            key: this.key,
            authToken: this.authToken
        })

        return auth.authenticate()
    }
}

