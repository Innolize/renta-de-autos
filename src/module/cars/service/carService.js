const CarNotDefinedError = require('./error/carNotDefined')
const CarIdNotDefinedError = require('./error/carIdNotDefined')

module.exports = class Service {
    constructor(carRepository) {
        this.carRepository = carRepository
    }

    async getAll() {
        return this.carRepository.getAll()
    }

    async save(car) {
        if (car === undefined) {
            throw new CarNotDefinedError()
        }
        return this.carRepository.save(car)
    }
    async getById(id) {
        if (id === undefined) {
            throw new CarIdNotDefinedError()
        }
        return this.carRepository.getById(id)
    }
    async remove(id) {
        if (id === undefined) {
            throw new CarIdNotDefinedError()
        }
        return this.carRepository.remove(id)
    }
}