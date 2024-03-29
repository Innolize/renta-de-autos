const { object, get, factory, default: DIContainer } = require('rsdi')
const { Sequelize } = require('sequelize')
const multer = require('multer')
const path = require('path')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

const { CarController, CarService, CarRepository, CarModel } = require('../module/cars/module')
const { UserController, UserModel, UserRepository, UserService } = require('../module/users/module')
const { RentController, RentRepository, RentService, RentModel } = require('../module/rent/module')

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

function configureUserModel(container) {
    UserModel.setup(container.get('Sequelize'))
    return UserModel
}

function configureRentModel(container) {
    RentModel.setup(container.get("Sequelize"))
    RentModel.setupCarAssociation(container.get('CarModel'))
    RentModel.setupUserAssociation(container.get('UserModel'))
    return RentModel
}

function addCarModuleDefinitions(container) {
    container.addDefinitions({
        CarController: object(CarController).construct(get('Multer'), get('CarService')),
        CarService: object(CarService).construct(get('CarRepository')),
        CarRepository: object(CarRepository).construct(get('CarModel')),
        CarModel: factory(configureCarModel)
    })
}

/**
 * 
 * @param {DIContainer} container 
 */

function addUserModuleDefinitions(container) {
    container.addDefinitions({
        UserController: object(UserController).construct(get('Multer'), get('UserService')),
        UserService: object(UserService).construct(get('UserRepository')),
        UserRepository: object(UserRepository).construct(get('UserModel')),
        UserModel: factory(configureUserModel)
    })
}

/**
 * 
 * @param {import('rsdi').default} container 
 */

function addRentModuleDefinitions(container) {
    container.addDefinitions({
        RentController: object(RentController).construct(get('Multer'), get('RentService'), get('CarService'), get('UserService')),
        RentService: object(RentService).construct(get("RentRepository")),
        RentRepository: object(RentRepository).construct(get('CarModel'), get('UserModel'), get('RentModel'), get('Sequelize')),
        RentModel: factory(configureRentModel)
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
    addUserModuleDefinitions(container)
    addRentModuleDefinitions(container)
    addCommonDefinitions(container)
    return container
}
