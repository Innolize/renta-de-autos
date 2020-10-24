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
        if (car === undefined) {
            throw new CarNotFoundError()
        }
        let newCar
        const options = { isNewRecord: !car.id }
        newCar = this.carModel.build(car, options)
        newCar = await newCar.save()
        return fromDbToEntity(newCar)
    }

    /**
     * 
     * @param {Number} id 
     */

    async getById(id) {
        const car = await this.carModel.findByPk(id)

        if (!car) {
            throw new CarNotFoundError()
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

        return Boolean(await this.carModel.destroy({
            where: {
                id: id
            }
        }))
    }
}