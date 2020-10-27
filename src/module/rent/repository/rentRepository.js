const AbstractRentRepository = require('./abstractRentRepository')
const { fromDbToEntity: userMapper } = require('../../users/mapper/userMapper')
const { fromDbToEntity: carMapper } = require('../../cars/mapper/carMapper')
const { fromDbToEntity: rentMapper } = require('../mapper/rentMapper')
const calcularPrecioTotal = require('../../../utility/calcularPrecioTotal')
const { Sequelize } = require('sequelize')

module.exports = class RentRepository extends AbstractRentRepository {

    /**
     * 
     * @param {import('../model/rentModel')} rentModel 
     * @param {import('sequelize').Sequelize} sequelizeInstance
     * @param {import('../../cars/model/carModel')} carModel
     * @param {import('../../users/model/userModel')} userModel
     */

    constructor(carModel, userModel, rentModel, sequelizeInstance) {
        super()
        this.carModel = carModel
        this.userModel = userModel
        this.rentModel = rentModel
        this.sequelize = sequelizeInstance
    }

    async getData() {
        const response = await this.rentModel.findAll()
        return response.map(x => x.toJSON())
    }

    async getUsersAvailable() {
        const response = await this.userModel.findAll({
            where: {
                disponible: true
            }
        })
        return response.map(x => userMapper(x))
    }

    async getCarsAvailable() {
        const response = await this.carModel.findAll({
            where: {
                disponible: true
            }
        })
        return response.map(x => carMapper(x))
    }

    /**
     * 
     * @param {import('../entity/Rent')} rent 
     */

    async save(rent) {
        let newRent



        const car = await this.carModel.findByPk(rent.idAutoRentado)
        rent.precioDia = car.precio
        rent.precioTotal = calcularPrecioTotal(rent.rentaInicio, rent.rentaTermina, car.precio)
        if (!car) {
            throw new error("auto rentado no existe")
        }
        const user = await this.userModel.findByPk(rent.idUsuarioRentado)
        if (!user) {
            throw new error("usuario rentado no existe")
        }

        const buildOptions = { isNewRecord: !rent.id }
        newRent = this.rentModel.build(rent, buildOptions)
        newRent.setDataValue('fk_auto', rent.idAutoRentado)
        newRent.setDataValue('fk_usuario', rent.idUsuarioRentado)
        newRent = await newRent.save()
        return rentMapper(newRent)


    }

}