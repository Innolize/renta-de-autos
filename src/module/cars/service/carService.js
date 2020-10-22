module.exports = class Service {
    constructor(carRepository) {
        this.carRepository = carRepository
    }

    async getData() {
        return this.carRepository.getData()
    }

    async save(car) {
        return this.carRepository.save(car)
    }
    async getById(id) {
        return this.carRepository.getById(id)
    }
    async remove(id){
        return this.carRepository.remove(id)
    }
}