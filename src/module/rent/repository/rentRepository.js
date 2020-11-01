const AbstractRentRepository = require('./abstractRentRepository')
const RentIdNotDefinedError = require('./error/rentIdNotDefinedError')
const { fromDbToEntity: userMapper } = require('../../users/mapper/userMapper')
const { fromDbToEntity: carMapper } = require('../../cars/mapper/carMapper')
const { fromDbToEntity: rentMapper } = require('../mapper/rentMapper')
const calcularPrecioTotal = require('../../../utility/calcularPrecioTotal')
const validarFechas = require('../../../utility/validacionFechas')
const { Op } = require('sequelize')

module.exports = class RentRepository extends AbstractRentRepository {

    /**
     * 
     * @param {import('../model/rentModel')} rentModel 
     * @param {import('sequelize').Sequelize} sequelizeInstance
     * @param {import('../../cars/model/carModel')} carModel
     * @param {import('../../users/model/userModel')} userModel
     */

    constructor(carModel, userModel, rentModel) {
        super()
        this.carModel = carModel
        this.userModel = userModel
        this.rentModel = rentModel
    }

    async getData() {
        const response = await this.rentModel.findAll({ include: ["AutoRentado", "UsuarioRentado"] })
        return response.map(x => x.toJSON())
    }

    /**
     * 
     * @param {import('../entity/Rent')} rent 
     */

    async save(rent) {
        let newRent

        validarFechas(rent.rentaInicio, rent.rentaTermina)

        const car = await this.carModel.findByPk(rent.AutoRentado.id)
        if (!car) {
            throw new Error("Auto rentado no existe")
        }
        rent.precioDia = car.precio
        rent.precioTotal = calcularPrecioTotal(rent.rentaInicio, rent.rentaTermina, car.precio)

        const user = await this.userModel.findByPk(rent.UsuarioRentado.id)
        if (!user) {
            throw new Error("Usuario rentado no existe")
        }

        // Si es una nueva renta, id es undefined y causa error
        // porque no puede buscar id: undefined. 
        // Esta validacion es un fix a ese problema

        let idNotDefined = 0
        let id = rent.id ? rent.id : idNotDefined

        let rentasSuperpuestas = await this.rentModel.findAll({
            where: {

                [Op.not]: {
                    id: id
                },
                [Op.or]: {
                    id_auto: {
                        [Op.like]: rent.AutoRentado.id
                    },
                    id_usuario: {
                        [Op.like]: rent.UsuarioRentado.id
                    }
                },
                rentaInicio: {
                    [Op.lt]: rent.rentaTermina
                },
                rentaTermina: {
                    [Op.gt]: rent.rentaInicio
                }
            }
        })
        let test = rentasSuperpuestas.map(x => x.toJSON())

        if (test.length > 0) {
            const ids = rentasSuperpuestas.map(renta => renta.id)
            throw new Error(`No se pudo crear, conflicto de fechas con renta/s de id ${ids}`)
        }

        const buildOptions = { isNewRecord: !rent.id }
        newRent = this.rentModel.build(rent, buildOptions)
        newRent.setDataValue("id_auto", rent.AutoRentado.id)
        newRent.setDataValue('id_usuario', rent.UsuarioRentado.id)
        console.log(newRent)
        newRent = await newRent.save()
        return rentMapper(newRent)
    }

    async remove(id) {
        if (!id) {
            throw new RentIdNotDefinedError()
        }
        const response = await this.rentModel.destroy({
            where: {
                id: id
            }
        })
        return Boolean(response)
    }

    async getSelectedRent(id) {
        if (!id) {
            throw new RentIdNotDefinedError()
        }
        const response = await this.rentModel.findByPk(id, { include: ["AutoRentado", "UsuarioRentado"] })
        return response.toJSON()
    }


}