const AbstractController = require('../../abstractController')

module.exports = class Controller extends AbstractController {
    constructor(uploadMiddleware, userService) {
        super()
        this.ROUTE_BASE = '/user'
        this.uploadMiddleware = uploadMiddleware
        this.userService = userService
    }
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
        res.render('users/view/index.html')
    }



}