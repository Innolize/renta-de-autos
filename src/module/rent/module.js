const RentController = require('./controller/rentController')
const RentService = require("./service/rentService")
const RentRepository = require("./repository/rentRepository")
const RentModel = require('./model/rentModel')

/**
 * 
 * @param {import('express').Application} app 
 * @param {import('rsdi').default} container 
 */

function init(app, container) {
    const controller = container.get("RentController")
    controller.configureRoutes(app)
}

module.exports = {
    init,
    RentController,
    RentService,
    RentRepository,
    RentModel
}