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

    async index(req, res) {
        const rents = await this.rentService.getData()
        console.log(rents)
        res.render("rent/view/index.html", { rents })
    }


}