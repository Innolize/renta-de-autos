const Car = require('../entity/Car')

function fromFormToEntity({ id, marca, modelo, año, kilometraje, color, "aire-acondicionado": aireAcondicionado, pasajeros, "caja-cambios": cajaCambios }) {
    return new Car({
        id,
        marca,
        modelo,
        año: Number(año),
        kilometraje: Number(kilometraje),
        color,
        aireAcondicionado: (aireAcondicionado === "true" ? true : false),
        pasajeros: Number(pasajeros),
        cajaCambios,
    })
}

function fromDbToEntity(array) {
    return array.map(x => x.toJSON())
}


module.exports = {
    fromFormToEntity,
    fromDbToEntity
}