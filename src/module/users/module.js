const UserController = require('./controller/userController')
const UserModel = require('./model/userModel')
const UserService = require('./service/userService')
const UserRepository = require('./repository/userRepository')

function init(app, container) {
    const controller = container.get('UserController')
    controller.configureRoutes(app)
}

module.exports = {
    init,
    UserController,
    UserModel,
    UserService,
    UserRepository
}