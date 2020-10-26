const AbstractController = require('../../abstractController')
const {fechaMinimaCalendariosDefault: fechaCalendarios} = require('../../../utility/fechaMinimaCalendarios')

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
        app.get(`${ROUTE}/form`, this.form.bind(this))
    }

    async index(req, res) {
        const rents = await this.rentService.getData()
        console.log(rents)
        res.render("rent/view/index.html", { rents })
    }

    async form(req, res) {
        const users = await this.rentService.getUsersAvailable()
        const cars = await this.rentService.getCarsAvailable()


        res.render("rent/view/form.html", { users, cars})
    }

}