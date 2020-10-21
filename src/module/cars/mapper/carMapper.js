const Car = require('../entity/Car')

function fromDataToEntity({ id, marca, modelo, año, kilometraje, color, "aire-acondicionado": aireAcondicionado, capacidad, "caja-cambios": cambios }) {
    return new Car({
        id, marca, modelo, año, kilometraje, color, aireAcondicionado, capacidad, cambios
    })
}

module.exports = {
    fromDataToEntity
}