const RentNotDefinedError = require('./error/rentNotDefinedError')
const RentIdNotDefinedError = require('./error/rentIdNotDefinedError')
const Rent = require('../entity/Rent')
const validarFechas = require('../../../utility/validacionFechas')
const calcularPrecioTotal = require('../../../utility/calcularPrecioTotal')
const CarIdNotDefined = require('../../cars/service/error/carIdNotDefined')
const UserIdNotDefinedError = require('../../users/controller/error/userIdNotDefinedError')

module.exports = class RentService {

    /**
     * 
     * @param {import('../repository/rentRepository')} rentRepository 
     */

    constructor(rentRepository) {
        this.rentRepository = rentRepository
    }

    async getAll() {
        return await this.rentRepository.getAll()
    }

    /**
     * 
     * @param {Rent} rent 
     */

    async save(rent) {

        if (!(rent instanceof Rent)) {
            throw new RentNotDefinedError()
        }

        const carId = rent.AutoRentado.id
        if (!carId) {
            throw new CarIdNotDefined()
        }
        const userId = rent.UsuarioRentado.id
        if (!userId) {
            throw new UserIdNotDefinedError()
        }

        validarFechas(rent.rentaInicio, rent.rentaTermina)
        const { car, user } = await this.rentRepository.validateCarAndUserExistence(carId, userId)

        rent.precioDia = car.precio
        rent.precioTotal = calcularPrecioTotal(rent.rentaInicio, rent.rentaTermina, car.precio)

        await this.rentRepository.getCarOrUserBookingBetweenDates(rent)


        return await this.rentRepository.save(rent)
    }

    async remove(id) {
        if (!id) {
            throw new RentIdNotDefinedError()
        }
        return await this.rentRepository.remove(id)
    }

    async getSelectedRent(id) {
        if (!id) {
            throw new RentIdNotDefinedError()
        }
        return await this.rentRepository.getSelectedRent(id)
    }
}