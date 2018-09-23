/**
 * This class will be used to route requests to the appropriate function,
 * then allowing either a result or a promise to be returned.
 * 
 * Actions that require authorisation will be checked against
 * the main auth db.
 * 
 * @param {string[]} paths 
 */
class Router {
    constructor(paths, type, ams) {

        this.type = type;
        this.paths = paths;

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
                return getList();
            }
        } else if (c == "article") {
            if (a == "info") {
                return getInfo();
            }
        }
    }

    route() {

    }
}