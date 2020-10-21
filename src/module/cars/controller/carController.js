

module.exports = class CarController {
    constructor() {
        this.ROUTE_BASE = "/car"
    }
    /**
     * @param {import('express').Application} app
     */

    configureRoutes(app) {
        const ROUTE = this.ROUTE_BASE



        app.get(`${ROUTE}`, this.index.bind(this))
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    index(req, res) {
        res.render("cars/view/test.html")
    }



}

