const { fromDbToEntity } = require('../mapper/userMapper')
const AbstractUserRepository = require('./abstractUserRepository')

module.exports = class UserRepository extends AbstractUserRepository {

    /**
     * 
     * @param {import('../model/userModel')} userModel 
     */

    constructor(userModel) {
        super()
        this.userModel = userModel
    }

    async getData() {
        const results = await this.userModel.findAll()
        return results.map(fromDbToEntity)
    }

    async getById(id) {
        console.log(id)
        const car = await this.userModel.findByPk(id)
        return fromDbToEntity(car)
    }

}