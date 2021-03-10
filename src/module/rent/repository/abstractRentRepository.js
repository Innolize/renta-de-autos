const AbstractRentRepositoryError = require('./error/abstractRentRepositoryError')

module.exports = class AbstractRentRepository {
    constructor(){
        if(new.target === AbstractRentRepository){
            throw new AbstractRentRepositoryError(
                'No se puede instanciar el repositorio de renta abstracto'
            )
        }
    }
 }