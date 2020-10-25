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
        const user = await this.userModel.findByPk(id)
        return fromDbToEntity(user)
    }

    async remove(id) {
        const user = await this.userModel.destroy({
            where: {
                id: id
            }
        })
        return user
    }

    async save(user) {
        let newUser
        const options = { isNewRecord: !user.id }
        newUser = this.userModel.build(user, options)
        newUser = await newUser.save()
        return fromDbToEntity(newUser)
    }
}