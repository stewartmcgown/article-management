import Authentication from './Authentication';
import AMS from './AMS';

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
 * @param {AMS} ams
 */
export class Router {
    constructor(e, type, ams) {
        this.type = type;
        this.paths = e.pathInfo.split('/')

        this.setOptions(e)

        this.ams = new AMS()
    }

    get allowedRoutes() {
        return {
            "GET": {
                "articles": ["list"],
                "article": ["info"],
                "authentication": ["authenticate"]
            },
            "POST": {
                "article": ["update", "delete"]
            }
        }
    }

    setOptions(e) {
        if (!e.parameter)
            return

        this.email = e.parameter.email
        this.key = e.parameter.key
        this.authToken = e.parameter.authToken
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
                return this.getList();
        else if (context == "article")
            if (action == "info")
                return this.getInfo();
        
    }

    /**
     * Process a POST request
     * @returns the requested data, or Unauthorised
     */
    routePOST() {

    }

    route() {
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

