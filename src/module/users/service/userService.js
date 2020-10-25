const userIdNotDefinedError = require('../controller/error/userIdNotDefinedError')
const userNotDefinedError = require('../controller/error/userNotDefinedError')

module.exports = class Service {
    constructor(userRepository) {
        this.userRepository = userRepository
    }

    async getData() {
        return await this.userRepository.getData()
    }

    async getById(id) {
        if (!id) {
            throw new userIdNotDefinedError()
        }
        return await this.userRepository.getById(id)
    }

    async remove(id) {
        if (!id) {
            throw new userIdNotDefinedError()
        }
        return await this.userRepository.remove(id)
    }

    async save(user) {
        if (!user) {
            throw new userNotDefinedError()
        }
        return await this.userRepository.save(user)
    }
}