module.exports = class Service {
    constructor(carRepository) {
        this.carRepository = carRepository
    }

    async getData() {
        return this.carRepository.getData()
    }
}