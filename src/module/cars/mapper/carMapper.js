const Car = require('../entity/Car')

function fromDataToEntity({ id, marca, modelo, año, kilometraje, color, "aire-acondicionado": aireAcondicionado, pasajeros, "caja-cambios": cajaCambios }) {
    return new Car({
        id,
        marca,
        modelo,
        año: Number(año),
        kilometraje: Number(kilometraje),
        color,
        aireAcondicionado: (aireAcondicionado === "true" ? true : false),
        pasajeros: Number(pasajeros),
        cajaCambios
    })
}

module.exports = {
    fromDataToEntity
}