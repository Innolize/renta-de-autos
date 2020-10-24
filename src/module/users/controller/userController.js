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
        //get
        app.get(`${ROUTE}`, this.index.bind(this))
        app.get(`${ROUTE}/view/:id`, this.view.bind(this))
        app.get(`${ROUTE}/form`, this.form.bind(this))
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async index(req, res) {
        const users = await this.userService.getData()
        console.log(users)
        res.render('users/view/index.html', { users })
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async view(req, res) {
        const { id } = req.params
        const user = await this.userService.getById(id)
        res.render('users/view/view.html', { user })
    }

    form(req, res) {
        res.render("users/view/form.html")
    }

}