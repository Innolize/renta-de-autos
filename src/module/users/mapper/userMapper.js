const User = require('../entity/User')

function fromFormToEntity({ id, nombre, apellido, "tipo-documento": tipoDocumento, "numero-documento": numeroDocumento, nacionalidad, direccion, telefono, email, nacimiento }) {
    return new User({
        id,
        nombre,
        apellido,
        tipoDocumento,
        numeroDocumento,
        nacionalidad,
        direccion,
        telefono,
        email,
        nacimiento
    })
}

function fromDbToEntity(model) {
    return new User(model.toJSON())
}

module.exports = {
    fromDbToEntity,
    fromFormToEntity
}