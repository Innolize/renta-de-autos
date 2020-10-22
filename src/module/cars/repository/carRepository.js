const { fromDbToEntity } = require('../mapper/carMapper')

module.exports = class Repository {

    /**
     * 
     * @param {import('../model/carModel')} carModel 
     */

    constructor(carModel) {
        this.carModel = carModel
    }

    async getData() {
        const carList = await this.carModel.findAll()
        return fromDbToEntity(carList)
    }
    async save(car) {
        const newCar = await this.carModel.build(car)
        newCar.save()
    }


}