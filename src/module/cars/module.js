const CarController = require('./controller/carController')
const CarService = require('./service/carService')
const CarRepository = require('./repository/carRepository')
const CarModel = require('./model/carModel')


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
    CarController,
    CarService,
    CarRepository,
    CarModel
}