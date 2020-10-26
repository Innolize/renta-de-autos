const Rent = require('../entity/Rent')

function formDbToEntity(model) {
    return new Rent(model.toJSON())
}

module.exports = {
    formDbToEntity
}