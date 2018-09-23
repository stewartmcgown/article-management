import Authentication from './Authentication';
import AMS from './AMS';

var SheetUtils = require('./SheetUtils').default
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
        this.parameters = e.parameter

        this.ams = new AMS()
    
        const a = {

            "GET" : {
                "articles": ["list"],
                "article": ["info"]
            }, 
            "POST" : {
                "article": ["update", "delete"]
            }

        }  
    }

    get email() {
        return this.parameters.email
    }

    getPaths() {
        return paths;
    }

    /**
     * @returns the first level of the two level API
     */
    context() {
        return paths[0];
    }

    /**
     * @returns the second level of the API
     */
    action() {
        return paths[1];
    }

    /**
     * Process a GET request
     * @returns the requested data, or Unauthorised
     */
    routeGET() {
        const c = this.context();
        const a = this.action();

        if (!doesPairExist(c, a, GET))
            throw "No such route exists."
        
        if (c == "authenticate") {
            return this.isAuthenticated()
        }

        // AUTHENTICATED TRACKS
        if (c == "articles") {
            if (a == "list") {
                return this.getList();
            }
        } else if (c == "article") {
            if (a == "info") {
                return getInfo();
            }
        }
    }

    /**
     * Process a POST request
     * @returns the requested data, or Unauthorised
     */
    routePOST() {

    }

    route() {
        return this.authenticate()
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
            email: this.email
        })

        return auth.authenticate("Editor Logins")
    }
}