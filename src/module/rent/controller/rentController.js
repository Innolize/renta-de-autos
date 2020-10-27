const AbstractController = require('../../abstractController')
const { fromFormToEntity } = require('../mapper/rentMapper')

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
        app.post(`${ROUTE}/save`, this.uploadMiddleware.none(), this.save.bind(this))
    }

    async index(req, res) {
        const rents = await this.rentService.getData()
        res.render("rent/view/index.html", { rents })
    }

    async form(req, res) {
        const users = await this.rentService.getUsersAvailable()
        const cars = await this.rentService.getCarsAvailable()

        res.render("rent/view/form.html", { users, cars })
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async save(req, res) {
        try {
            const rent = fromFormToEntity(req.body)

            const savedRent = await this.rentService.save(rent)

            res.redirect('rent/view/form.html')

        } catch (e) {
            console.log(e)
        }

    }

}