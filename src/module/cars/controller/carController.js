const { fromFormToEntity } = require('../mapper/carMapper')
const AbstractController = require('../../abstractController')
const CarIdNotDefinedError = require('../repository/error/carIdNotDefinedError')

module.exports = class CarController extends AbstractController {
    constructor(uploadMiddleware, carService) {
        super()
        this.ROUTE_BASE = "/car"
        this.carService = carService
        this.uploadMiddleware = uploadMiddleware
    }
    /**
     * @param {import('express').Application} app
     */

    configureRoutes(app) {
        const ROUTE = this.ROUTE_BASE
        //get
        app.get(`${ROUTE}`, this.index.bind(this))
        app.get(`${ROUTE}/form`, this.form.bind(this))
        app.get(`${ROUTE}/view/:id`, this.view.bind(this))
        app.get(`${ROUTE}/edit/:id`, this.edit.bind(this))
        //post
        app.post(`${ROUTE}/save`, this.uploadMiddleware.single('imagen'), this.save.bind(this))
        app.post(`${ROUTE}/remove/:id`, this.remove.bind(this))
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async index(req, res) {
        const cars = await this.carService.getData()
        console.log(cars)
        const { errors, messages } = req.session
        res.render("cars/view/index.html", { cars, messages, errors })
        req.session.messages = []
        req.session.errors = []
    }

    form(req, res) {
        res.render("cars/view/form.html")
    }

    async save(req, res) {
        try {
            const car = fromFormToEntity(req.body)
            if (req.file) {
                const { filename } = req.file
                car.imagen = `/uploads/cars/${filename}`
            }
            const savedCar = await this.carService.save(car)

            if (car.id) {
                req.session.messages = [`El auto con id ${car.id} se actualizo con exito`]
            } else {
                req.session.messages = [`Se creo nuevo auto con id ${savedCar.id}`]
            }
            res.redirect("/car")

        } catch (e) {
            req.session.errors = [e.message]
            res.redirect("/car")
        }


    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async view(req, res) {
        const { id } = req.params
        if (!id) {
            throw new CarIdNotDefinedError()
        }
        try {
            const car = await this.carService.getById(id)
            res.render("cars/view/view.html", { car })
        } catch (e) {
            req.session.messages = [e.message]
            res.redirect('/car')
        }
    }

    async edit(req, res) {
        const { id } = req.params
        if (!id) {
            throw new CarIdNotDefinedError()
        }
        try {
            const car = await this.carService.getById(id)
            res.render("cars/view/form.html", { car })
        } catch (e) {
            req.session.errors = [e.message]
            res.redirect('/car')
        }
    }

    async remove(req, res) {
        const { id } = req.params
        if (!id) {
            throw new CarIdNotDefinedError()
        }
        try {
            const car = await this.carService.remove(id)
            req.session.messages = [`El auto con id ${id} se ha eliminado`]
        } catch (e) {
            req.session.errors = [`No se pudo eliminar el auto con id ${id}`]
        }
        res.redirect("/car")
    }
}

