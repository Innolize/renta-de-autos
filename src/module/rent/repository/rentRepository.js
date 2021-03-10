const AbstractRentRepository = require('./abstractRentRepository')
const RentIdNotDefinedError = require('./error/rentIdNotDefinedError')
const NonExistentUserError = require('./error/nonExistentUserError')
const NonExistentCarError = require('./error/nonExistentCarError')
const { fromDbToEntity: userMapper } = require('../../users/mapper/userMapper')
const { fromDbToEntity: carMapper } = require('../../cars/mapper/carMapper')
const { fromDbToEntity: rentMapper } = require('../mapper/rentMapper')

const { Op } = require('sequelize')
const BookingConflictError = require('./error/bookingConflictError')

module.exports = class RentRepository extends AbstractRentRepository {

    /**
     * 
     * @param {import('../model/rentModel')} rentModel 
     * @param {import('../../cars/model/carModel')} carModel
     * @param {import('../../users/model/userModel')} userModel
     */

    constructor(carModel, userModel, rentModel) {
        super()
        this.carModel = carModel
        this.userModel = userModel
        this.rentModel = rentModel
    }

    async getAll() {
        const response = await this.rentModel.findAll({ include: ["AutoRentado", "UsuarioRentado"] })
        return response.map(x => x.toJSON())
    }

    /**
     * 
     * @param {import('../entity/Rent')} rent 
     */

    async save(rent) {

        const buildOptions = { isNewRecord: !rent.id }
        let newRent = this.rentModel.build(rent, buildOptions)
        newRent.setDataValue("id_auto", rent.AutoRentado.id)
        newRent.setDataValue('id_usuario', rent.UsuarioRentado.id)
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
        return rentMapper(response)
    }

    async getCarOrUserBookingBetweenDates(rent) {

        // Si es una nueva renta, id es undefined y causa error
        // porque no puede buscar id: undefined. 
        // Esta validacion es un fix a ese problema

        const idNotDefined = 0
        const id = rent.id || idNotDefined

        const rentasSuperpuestas = await this.rentModel.findAll({
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
        const rentasSuperpuestasResultado = rentasSuperpuestas.map(x => x.toJSON())

        if (rentasSuperpuestasResultado.length > 0) {
            const ids = rentasSuperpuestas.map(renta => renta.id)
            throw new BookingConflictError(`No se pudo crear, conflicto de fechas con renta/s de id ${ids}`)
        }
    }

    async validateCarAndUserExistence(carId, userId) {
        const car = await this.carModel.findByPk(carId)
        if (!car) {
            throw new NonExistentCarError("Auto rentado no existe")
        }
        const user = await this.userModel.findByPk(userId)
        if (!user) {
            throw new NonExistentUserError("Usuario rentado no existe")
        }
        return { car: carMapper(car), user: userMapper(user) }
    }

}