const { fromDbToEntity } = require('../mapper/userMapper')
const AbstractUserRepository = require('./abstractUserRepository')
const UserIdNotDefinedError = require('../controller/error/userIdNotDefinedError')
const UserNotDefinedError = require('../controller/error/userNotDefinedError')

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
        if (!id) {
            throw new UserIdNotDefinedError()
        }
        const user = await this.userModel.findByPk(id)
        return fromDbToEntity(user)
    }

    async remove(id) {
        if (!id) {
            throw new UserIdNotDefinedError()
        }
        const user = await this.userModel.destroy({
            where: {
                id: id
            }
        })
        return user
    }

    async save(user) {
        if (!user) {
            throw new UserNotDefinedError()
        }
        let newUser
        const options = { isNewRecord: !user.id }
        newUser = this.userModel.build(user, options)
        newUser = await newUser.save()
        return fromDbToEntity(newUser)
    }
}