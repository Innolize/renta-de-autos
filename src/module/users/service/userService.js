const UserIdNotDefinedError = require('../controller/error/userIdNotDefinedError')
const UserNotDefinedError = require('../controller/error/userNotDefinedError')

module.exports = class Service {
    constructor(userRepository) {
        this.userRepository = userRepository
    }

    async getAll() {
        return await this.userRepository.getAll()
    }

    async getById(id) {
        if (!id) {
            throw new UserIdNotDefinedError()
        }
        return await this.userRepository.getById(id)
    }

    async remove(id) {
        if (!id) {
            throw new UserIdNotDefinedError()
        }
        return await this.userRepository.remove(id)
    }

    async save(user) {
        if (!user) {
            throw new UserNotDefinedError()
        }
        return await this.userRepository.save(user)
    }
}