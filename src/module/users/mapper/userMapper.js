const User = require('../entity/User')

function fromDbToEntity(model) {
    return new User(model.toJSON())
}

module.exports = {
    fromDbToEntity
}