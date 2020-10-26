

module.exports = class RentService {
    constructor(rentRepository) {
        this.rentRepository = rentRepository
    }

    async getData() {
        return await this.rentRepository.getData()
    }
}