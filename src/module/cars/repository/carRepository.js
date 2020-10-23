const { fromDbToEntity } = require('../mapper/carMapper')
const CarIdNotDefinedError = require('./error/carIdNotDefinedError')
const CarNotFoundError = require('./error/carNotFoundError')
const AbstractCarRepository = require('./abstractCarRepository')

module.exports = class Repository extends AbstractCarRepository {

    /**
     * 
     * @param {import('../model/carModel')} carModel 
     */

    constructor(carModel) {
        super()
        this.carModel = carModel
    }

    async getData() {
        const carList = await this.carModel.findAll()
        return carList.map(fromDbToEntity)
    }

    /**
     * 
     * @param {import('../entity/Car')} car 
     */

    async save(car) {
        const options = { isNewRecord: !car.id }
        const newCar = await this.carModel.build(car, options)
        return newCar.save()
    }

    /**
     * 
     * @param {Number} id 
     */

    async getById(id) {
        const car = await this.carModel.findByPk(id)

        if (!car) {
            throw new CarNotFoundError(`No se encontro un auto con id ${id}`)
        }

        return fromDbToEntity(car)
    }

    /**
     * 
     * @param {Number} id 
     */

    async remove(id) {

        if (!id) {
            throw new CarIdNotDefinedError(`No se encontro id`)
        }

        return await this.carModel.destroy({
            where: {
                id: id
            }
        })
    }
}