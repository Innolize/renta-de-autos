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
        console.log(car)
        const options = { isNewRecord: !car.id }
        const newCar = await this.carModel.build(car, options)
        newCar.save()
    }
    async getById(id) {
        return await this.carModel.findByPk(id)
    }
    async remove(id) {
        return await this.carModel.destroy({
            where: {
                id: id
            }
        })
    }
}