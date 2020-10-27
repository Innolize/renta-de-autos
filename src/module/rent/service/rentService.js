

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

    async save(rent) {
        return await this.rentRepository.save(rent)
    }

    async remove(id) {
        return await this.rentRepository.remove(id)
    }

    async getSelectedRent(id) {
        return await this.rentRepository.getSelectedRent(id)
    }

}