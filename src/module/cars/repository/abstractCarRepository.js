const AbstractCarRepositoryError = require('./error/abstractCarRepositoryError')

module.exports = class AbstractCarRepository {
    constructor() {
        if (new.target === AbstractCarRepository) {
            throw new AbstractCarRepositoryError(
                'No se puede instanciar el repositorio de autos abstracto'
            )
        }
    }
}