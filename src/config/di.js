const { object, get, factory, default: DIContainer } = require('rsdi')
const { Sequelize } = require('sequelize')
const { CarController, CarService, CarRepository, CarModel } = require('../module/cars/module')
const multer = require('multer')
const path = require('path')

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
        CarController: object(CarController).construct(get('Multer'), get('CarService')),
        CarService: object(CarService).construct(get('CarRepository')),
        CarRepository: object(CarRepository).construct(get('CarModel')),
        CarModel: factory(configureCarModel)
    })
}

function configureMulter() {
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, process.env.CAR_UPLOAD_IMG)
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname))
        }
    })
    return multer({ storage })
}


/**
 * 
 * @param {DIContainer} container
 */
function addCommonDefinitions(container) {
    container.addDefinitions({
        Sequelize: factory(configureMainDatabase),
        Multer: factory(configureMulter)
    })
}

module.exports = function configureDI() {
    const container = new DIContainer()
    addCarModuleDefinitions(container)
    addCommonDefinitions(container)
    return container
}
