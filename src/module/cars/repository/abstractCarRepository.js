const AbstractController = require("../../abstractController")

module.exports = class AbstractCarRepository {
    constructor() {
        if (new.target === AbstractCarRepository) {
            throw new AbstractCarRepositoryError(
                'No se puede instanciar el repositorio de autos abstracto'
            )
        }
    }
}