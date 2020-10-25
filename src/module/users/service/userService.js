module.exports = class Service {
    constructor(userRepository) {
        this.userRepository = userRepository
    }

    async getData() {
        return await this.userRepository.getData()
    }

    async getById(id) {
        return await this.userRepository.getById(id)
    }

    async remove(id) {
        return await this.userRepository.remove(id)
    }

    async save(user) {
        return await this.userRepository.save(user)
    }
}