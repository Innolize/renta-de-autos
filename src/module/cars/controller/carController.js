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
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async index(req, res) {
        await this.carService.getData()
        res.render("cars/view/index.html")
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
    }
}

