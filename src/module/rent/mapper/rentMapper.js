const Rent = require('../entity/Rent')
const User = require('../../users/entity/User')
const Car = require('../../cars/entity/Car')

function fromDbToEntity(model) {
    return new Rent(model.toJSON())
}

function fromFormToEntity({
    id,
    'renta-inicio': rentaInicio,
    'renta-termina': rentaTermina,
    precioDia, precioTotal,
    'forma-pago': formaPago,
    abonado,
    "usuario-seleccionado": usuarioRentadoId,
    'auto-seleccionado': autoRentadoId
}) {
    return new Rent({
        id: Number(id),
        rentaInicio,
        rentaTermina,
        precioDia,
        precioTotal,
        formaPago,
        abonado,
        AutoRentado: new Car({ id: Number(autoRentadoId) }),
        UsuarioRentado: new User({ id: Number(usuarioRentadoId) })
    })
}

module.exports = {
    fromDbToEntity,
    fromFormToEntity
}