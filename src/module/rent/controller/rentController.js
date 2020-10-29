const session = require('express-session')
const AbstractController = require('../../abstractController')
const { fromFormToEntity } = require('../mapper/rentMapper')
const RentIdNotDefinedError = require('./error/rentIdNotDefinedError')

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

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async index(req, res) {
        const { errors, messages } = req.session
        const rents = await this.rentService.getData()
        res.render("rent/view/index.html", { rents, errors, messages })
        req.session.errors = []
        req.session.messages = []
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async form(req, res) {
        const users = await this.rentService.getUsersAvailable()
        if (users.length = 0) {
            req.session.errors = [`No se puede crear una renta sin usuarios en la base de datos`]
            res.redirect('/rent')
        }

        const cars = await this.rentService.getCarsAvailable()

        if (cars.length = 0) {
            req.session.errors = [`No se puede crear una renta sin vehiculos en la base de datos`]
            res.redirect('/rent')
        }

        res.render("rent/view/form.html", { users, cars })
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async view(req, res) {
        try {
            const { id } = req.params
            if (!id) {
                throw new RentIdNotDefinedError()
            }

            const rent = await this.rentService.getSelectedRent(id)
            res.render('rent/view/view.html', { rent })
        } catch (e) {
            req.session.errors = [e.message]
            res.redirect('/rent')
        }
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
            if (rent.id) {
                req.session.messages = [`Se actualizo renta con id ${rent.id}`]
            } else {
                req.session.messages = [`Se creo renta con id ${savedRent.id}`]
            }

        } catch (e) {
            req.session.errors = [e.message]
        }
        res.redirect('/rent')
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async edit(req, res) {
        try {
            const { id } = req.params
            if (!id) {
                throw new RentIdNotDefinedError()
            }
            const users = await this.rentService.getUsersAvailable()

            if (users.length = 0) {
                req.session.errors = [`No se puede editar una renta sin usuarios en la base de datos`]
                res.redirect('/rent')
            }

            const cars = await this.rentService.getCarsAvailable()

            if (cars.length = 0) {
                req.session.errors = [`No se puede editar una renta sin vehiculos en la base de datos`]
                res.redirect('/rent')
            }

            const rent = await this.rentService.getSelectedRent(id)

            res.render('rent/view/form.html', { rent, users, cars })


        } catch (e) {
            req.session.errors = [e.message]
            res.redirect('/rent')
        }
    }

    /**
    * 
    * @param {import('express').Request} req 
    * @param {import('express').Response} res 
    */

    async remove(req, res) {
        try {
            const { id } = req.params
            if (!id) {
                throw new RentIdNotDefinedError()
            }

            const rentDeleted = await this.rentService.remove(id)
            if (rentDeleted) {
                req.session.messages = [`La renta con id ${id} se elimino con exito`]
            }
        } catch (e) {
            req.errors = [e.message]
        }
        res.redirect('/rent')
    }
}