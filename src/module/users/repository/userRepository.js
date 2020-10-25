const { fromDbToEntity } = require('../mapper/userMapper')
const AbstractUserRepository = require('./abstractUserRepository')
const UserIdNotDefinedError = require('./error/userIdNotDefinedError')
const UserNotDefinedError = require('./error/userNotDefinedError')
const UserNotFoundError = require('./error/userNotFoundError')

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
        if (!user) {
            throw new UserNotFoundError()
        }
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
        return Boolean(user)
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