const AbstractRentRepository = require('./abstractRentRepository')

module.exports = class RentRepository extends AbstractRentRepository {

    /**
     * 
     * @param {import('../model/rentModel')} rentModel 
     */

    constructor(carModel, userModel, rentModel) {
        super()
        this.carModel = carModel
        this.userModel = userModel
        this.rentModel = rentModel
    }

    async getData() {
        const response = await this.rentModel.findAll()
        return response.map(x => x.toJSON())
    }

    async getUsersAvailable() {
        const response = await this.userModel.findAll({
            where: {
                disponible: true
            }
        })
        return response.map(x => x.toJSON())
    }

}