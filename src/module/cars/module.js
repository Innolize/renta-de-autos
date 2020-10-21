const CarController = require('./controller/carController')


/**
 * 
 * @param {import('express').Application} app 
 * @param {import('rsdi').IDIContainer} container
 */

function init(app, container) {
    const controller = container.get('CarController')
    controller.configureRoutes(app)
}

module.exports = {
    init,
    CarController
}