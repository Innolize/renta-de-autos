const UserController = require('./controller/userController')
const UserModel = require('./model/userModel')

function init(app, container) {
    const controller = container.get('UserController')
    controller.configureRoutes(app)
}

module.exports = {
    init,
    UserController,
    UserModel
}