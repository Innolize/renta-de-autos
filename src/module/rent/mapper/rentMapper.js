const Rent = require('../entity/Rent')

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
    "usuario-seleccionado": idUsuarioRentado,
    'auto-seleccionado': idAutoRentado }) {
    return new Rent(id,
        rentaInicio,
        rentaTermina,
        precioDia,
        precioTotal,
        formaPago,
        abonado,
        idAutoRentado,
        idUsuarioRentado)
}

module.exports = {
    fromDbToEntity,
    fromFormToEntity
}