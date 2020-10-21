const { object, get, factory, default: DIContainer } = require('rsdi')

const { CarController } = require('../module/cars/module')

/**
 * 
 * @param {DIContainer} container 
 */

function addCarModuleDefinitions(container) {
    container.addDefinitions({
        CarController: object(CarController)
    })
}

module.exports = function configureDI() {
    const container = new DIContainer()
    addCarModuleDefinitions(container)
    return container
}
