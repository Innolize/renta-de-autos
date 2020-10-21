

module.exports = class CarController {
    constructor(carService) {
        this.ROUTE_BASE = "/car"
        this.carService = carService
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

    async index(req, res) {
        await this.carService.getData()
        res.render("cars/view/test.html")
    }

}

