const AbstractRentRepository = require('./abstractRentRepository')

module.exports = class RentRepository extends AbstractRentRepository {
    constructor(rentModel) {
        super()
        this.rentModel = rentModel
    }
}