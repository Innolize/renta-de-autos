

module.exports = class RentService {
    constructor(rentRepository) {
        this.rentRepository = rentRepository
    }

    async getData() {
        return await this.rentRepository.getData()
    }

    async getUsersAvailable() {
        return await this.rentRepository.getUsersAvailable()
    }

    async getCarsAvailable() {
        return await this.rentRepository.getCarsAvailable()
    }
}