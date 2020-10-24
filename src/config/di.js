const { object, get, factory, default: DIContainer } = require('rsdi')
const { Sequelize } = require('sequelize')
const { CarController, CarService, CarRepository, CarModel } = require('../module/cars/module')
const multer = require('multer')
const path = require('path')
const session = require('express-session')
const { sequelize } = require('../module/cars/model/carModel')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

/**
 * 
 * @param {DIContainer} container 
 */

function configureSesioneDatabase() {
    const sequelizeSession = new Sequelize({
        dialect: 'sqlite',
        storage: process.env.DB_SESSION_PATH
    })
    return sequelizeSession
}

/**
 * 
 * @param {DIContainer} container 
 */

function configureSession(container) {
    const ONE_WEEK_IN_SECONDS = 604800000
    const sequelize = container.get('SessionSequelize')
    const sessionOptions = {
        store: new SequelizeStore({ db: sequelize }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: ONE_WEEK_IN_SECONDS }
    }
    return session(sessionOptions)
}

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
        SessionSequelize: factory(configureSesioneDatabase),
        Session: factory(configureSession),
        Multer: factory(configureMulter)
    })
}

module.exports = function configureDI() {
    const container = new DIContainer()
    addCarModuleDefinitions(container)
    addCommonDefinitions(container)
    return container
}
