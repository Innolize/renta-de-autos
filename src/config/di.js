const { object, get, factory, default: DIContainer } = require('rsdi')
const { Sequelize } = require('sequelize')
const { CarController, CarService, CarRepository, CarModel } = require('../module/cars/module')

/**
 * 
 * @param {DIContainer} container 
 */

function configureMainDatabase() {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.DB_PATH
    })
    return sequelize
}

/**
 * 
 * @param {import('rsdi').IDIContainer} container 
 */

function configureCarModel(container) {
    CarModel.setup(container.get('Sequelize'))
    return CarModel
}

function addCarModuleDefinitions(container) {
    container.addDefinitions({
        CarController: object(CarController).construct(get('CarService')),
        CarService: object(CarService).construct(get('CarRepository')),
        CarRepository: object(CarRepository).construct(get('CarModel')),
        CarModel: factory(configureCarModel)
    })
}

/**
 * 
 * @param {DIContainer} container
 */
function addCommonDefinitions(container) {
    container.addDefinitions({
        Sequelize: factory(configureMainDatabase)
    })
}

module.exports = function configureDI() {
    const container = new DIContainer()
    addCarModuleDefinitions(container)
    addCommonDefinitions(container)
    return container
}