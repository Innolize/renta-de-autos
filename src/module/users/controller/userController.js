const AbstractController = require('../../abstractController')
const { fromFormToEntity } = require('../mapper/userMapper')

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
        app.get(`${ROUTE}/edit/:id`, this.edit.bind(this))
        app.post(`${ROUTE}/remove/:id`, this.remove.bind(this))
        app.post(`${ROUTE}/save`, this.uploadMiddleware.none(), this.save.bind(this))
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
        console.log(user)
        res.render('users/view/view.html', { user })
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async save(req, res) {
        const formData = req.body
        const user = fromFormToEntity(formData)
        const savedUser = await this.userService.save(user)
        console.log(savedUser)
        res.redirect('/user')
    }

    form(req, res) {
        res.render("users/view/form.html")
    }

    async edit(req, res) {
        const { id } = req.params
        const user = await this.userService.getById(id)

        res.render("users/view/form.html", { user })
    }

    /**
     * 
     * @param {import('express').Application} req 
     * @param {import('express').Response} res 
     */

    async remove(req, res) {
        const { id } = req.params
        const user = await this.userService.remove(id)
        res.redirect('/user')
    }
}