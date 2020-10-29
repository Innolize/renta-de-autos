const RentNotDefinedError = require('./error/rentNotDefinedError')
const RentIdNotDefinedError = require('./error/rentIdNotDefinedError')
const Rent = require('../entity/Rent')

module.exports = class RentService {
    constructor(rentRepository) {
        this.rentRepository = rentRepository
    }

    async getData() {
        return await this.rentRepository.getData()
    }

    async save(rent) {
        if (!(rent instanceof Rent)) {
            throw new RentNotDefinedError()
        }
        return await this.rentRepository.save(rent)
    }

    async remove(id) {
        if (!id) {
            throw new RentIdNotDefinedError()
        }
        return await this.rentRepository.remove(id)
    }

    async getSelectedRent(id) {
        if (!id) {
            throw new RentIdNotDefinedError()
        }
        return await this.rentRepository.getSelectedRent(id)
    }

}