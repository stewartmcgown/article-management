var SheetUtils = require('./SheetUtils').default,
    AMS = require('./AMS').default;


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
        this.parameter = e.parameter

        this.ams = ams;
    
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

    getPaths() {
        return paths;
    }

    context() {
        return paths[0];
    }

    action() {
        return paths[1];
    }

    execute() {
        if (this.type == "GET")
            return this.routeGET()
        else if (this.type == "POST")
            return this.routePOST()
    }

    routeGET() {
        const c = this.context();
        const a = this.action();

        if (!doesPairExist(c, a, GET))
            throw "No such route exists."
        
        // Time to route
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

    routePOST() {

    }

    route() {
        if (!this.isAuthenticated)
            return "Unauthorised"

        switch (this.type) {
            case "GET":
                return this.routeGET()
                break
            case "POST":
                return this.routePOST()
                break
        }
    }

    get isAuthenticated() {
        let authList = SheetUtils.getSheetAsArray("")
    }
}