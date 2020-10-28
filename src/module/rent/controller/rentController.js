const AbstractController = require('../../abstractController')
const { fromFormToEntity } = require('../mapper/rentMapper')

module.exports = class RentController extends AbstractController {

    /**
     * 
     * @param {import('multer').Multer} uploadMiddleware 
     * @param {import('../service/rentService')} rentService 
     */

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
        app.get(`${ROUTE}/view/:id`, this.view.bind(this))
        app.get(`${ROUTE}/edit/:id`, this.edit.bind(this))
        app.post(`${ROUTE}/save`, this.uploadMiddleware.none(), this.save.bind(this))
        app.post(`${ROUTE}/remove/:id`, this.remove.bind(this))

    }

    async index(req, res) {
        const rents = await this.rentService.getData()
        console.log(rents)
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

    async view(req, res) {
        const { id } = req.params
        const rent = await this.rentService.getSelectedRent(id)
        res.render('rent/view/view.html', { rent })
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
            res.redirect('/rent')

        } catch (e) {
            console.log(e)
        }
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async edit(req, res) {
        const { id } = req.params
        const users = await this.rentService.getUsersAvailable()
        const cars = await this.rentService.getCarsAvailable()
        const rent = await this.rentService.getSelectedRent(id)

        res.render('rent/view/form.html', { rent, users, cars })
    }

    /**
    * 
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    */

    async remove(req, res) {
        const { id } = req.params
        const rentDeleted = await this.rentService.remove(id)
        if (rentDeleted) {
            console.log('Se elimino con exito')
        }
        res.redirect('/rent')
    }
}