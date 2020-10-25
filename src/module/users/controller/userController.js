const AbstractController = require('../../abstractController')
const UserIdNotDefinedError = require('./error/userIdNotDefinedError')
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
        app.get(`${ROUTE}/form`, this.create.bind(this))
        app.get(`${ROUTE}/edit/:id`, this.edit.bind(this))
        app.get(`${ROUTE}/remove/:id`, this.removeConfirmation.bind(this))
        //post
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
        const { messages, errors } = req.session
        res.render('users/view/index.html', { users, messages, errors })
        req.session.messages = []
        req.session.errors = []
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async view(req, res) {
        const { id } = req.params
        if (!id) {
            throw new UserIdNotDefinedError()
        }
        try {
            const user = await this.userService.getById(id)
            res.render('users/view/view.html', { user })
        } catch (e) {
            req.session.errors = [e.message]
            res.redirect('/user')
        }
    }

    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async save(req, res) {
        try {
            const formData = req.body
            const user = fromFormToEntity(formData)
            const savedUser = await this.userService.save(user)

            if (user.id) {
                req.session.messages = [`El usuario con id ${user.id} se actualizó con éxito`]
            } else {
                req.session.messages = [`El usuario con id ${savedUser.id} se creó con éxito`]
            }
            res.redirect('/user')

        } catch (e) {
            req.session.errors = [e.message]
            res.redirect('/user')
        }


    }

    create(req, res) {
        res.render("users/view/form.html")
    }


    /**
     * 
     * @param {import('express').Request} req 
     * @param {import('express').Response} res 
     */

    async edit(req, res) {
        const { id } = req.params
        if (!id) {
            throw new UserIdNotDefinedError()
        }
        try {
            const user = await this.userService.getById(id)
            res.render("users/view/form.html", { user })
        } catch (e) {
            req.session.errors = [e.message]
            res.redirect('/user')
        }
    }

    /**
     * 
     * @param {import('express').Application} req 
     * @param {import('express').Response} res 
     */

    async removeConfirmation(req, res) {
        const { id } = req.params
        if (!id) {
            throw new UserIdNotDefinedError()
        }
        try {
            const user = await this.userService.getById(id)
            res.render('users/view/delete.html', { user })
        } catch (e) {
            req.session.errors = [e.message]
            res.redirect('/user')
        }
    }

    /**
    * 
    * @param {import('express').Application} req 
    * @param {import('express').Response} res 
    */

    async remove(req, res) {
        const { id } = req.params
        if (!id) {
            throw new UserIdNotDefinedError()
        }
        try {
            const user = await this.userService.remove(id)
            req.session.messages = [`El usuario con id ${id} se ha eliminado`]
        } catch (e) {
            req.session.errors = [`No se pudo eliminar el usuario con id ${id}`]
        }
        res.redirect('/user')
    }
}