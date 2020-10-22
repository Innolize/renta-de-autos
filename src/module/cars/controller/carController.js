const { fromFormToEntity } = require('../mapper/carMapper')

module.exports = class CarController {
    constructor(uploadMiddleware, carService) {
        this.ROUTE_BASE = "/car"
        this.carService = carService
        this.uploadMiddleware = uploadMiddleware
    }
    /**
     * @param {import('express').Application} app
     */

    configureRoutes(app) {
        const ROUTE = this.ROUTE_BASE
        app.get(`${ROUTE}`, this.index.bind(this))
        app.get(`${ROUTE}/form`, this.form.bind(this))
        app.post(`${ROUTE}/save`, this.uploadMiddleware.single('imagen'), this.save.bind(this))
        app.get(`${ROUTE}/view/:id`, this.view.bind(this))
        app.get(`${ROUTE}/edit/:id`, this.edit.bind(this))
        app.post(`${ROUTE}/remove/:id`, this.remove.bind(this))
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async index(req, res) {
        const cars = await this.carService.getData()
        res.render("cars/view/index.html", { cars })
    }

    form(req, res) {
        res.render("cars/view/form.html")
    }

    async save(req, res) {
        const car = fromFormToEntity(req.body)
        if (req.file) {
            console.log(req.file)
            const { filename } = req.file
            car.imagen = `/uploads/cars/${filename}`
        }
        await this.carService.save(car)

        res.redirect("/car")
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async view(req, res) {
        const { id } = req.params
        const car = await this.carService.getById(id)
        res.render("cars/view/view.html", { car })
    }

    async edit(req, res) {
        const { id } = req.params
        const car = await this.carService.getById(id)
        res.render("cars/view/form.html", { car })
    }
    async remove(req, res) {
        const { id } = req.params
        const car = await this.carService.remove(id)
        res.redirect("/car")
    }
}

