const AbstractRentRepository = require('./abstractRentRepository')

module.exports = class RentRepository extends AbstractRentRepository {

    /**
     * 
     * @param {import('../model/rentModel')} rentModel 
     */

    constructor(rentModel) {
        super()
        this.rentModel = rentModel
    }

    async getData() {
        const response = await this.rentModel.findAll()
        return response.map(x => x.toJSON())
    }

}