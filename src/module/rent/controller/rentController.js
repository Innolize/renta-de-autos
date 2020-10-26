const AbstractController = require('../../abstractController')

module.exports = class RentController extends AbstractController {
    constructor(uploadMiddleware, rentService) {
        super()
        this.ROUTE_BASE = "/rent"
        this.uploadMiddleware = uploadMiddleware
        this.rentService = rentService
    }

    /**
     * 
     * @param {import('express').Application} app 
     */

    configureRoutes(app) {
        const ROUTE = this.ROUTE_BASE
        app.get(`${ROUTE}`, this.index.bind(this))
    }

    index(req, res) {
        res.render("rent/view/index/html")
    }


}