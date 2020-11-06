const RentService = require('../rentService')
const RentNotDefinedError = require('../error/rentNotDefinedError')
const RentIdNotDefinedError = require('../error/rentIdNotDefinedError')
const RentEntity = require('../../entity/Rent')
const Repository = require('../../../cars/repository/carRepository')
const CarIdNotDefinedError = require('../../../cars/service/error/carIdNotDefined')
const UserIdNotDefinedError = require('../../../users/controller/error/userIdNotDefinedError')

const rentRepository = {
    getAll: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    getSelectedRent: jest.fn(),
    validateCarAndUserExistence: jest.fn(() => Promise.resolve({ car: { precio: 100 } })),
    getCarOrUserBookingBetweenDates: jest.fn()
}

const mockObject = new RentEntity({
    id: 1,
    rentaInicio: "2020-05-05",
    rentaTermina: "2020-05-09",
    precioDia: undefined,
    precioTotal: undefined,
    formaPago: "efectivo",
    abonado: true,
    AutoRentado: { id: 2 },
    UsuarioRentado: { id: 1 },
})

const service = new RentService(rentRepository)

test('getAll llama a rentRepository.getAll una vez', async () => {
    await service.getAll()
    expect(rentRepository.getAll).toHaveBeenCalledTimes(1)
})

test('save devuelve error al no pasarle rent', async () => {
    await expect(service.save).rejects.toThrowError(RentNotDefinedError)
})

test('save devuelve error si el auto rentado no tiene id', async () => {
    const newMockObject = new RentEntity({ ...mockObject, AutoRentado: { id: undefined } })
    await expect(service.save(newMockObject)).rejects.toThrowError(CarIdNotDefinedError)
})

test('save devuelve error si el usuario rentado no tiene id', async () => {
    const newMockObject = new RentEntity({ ...mockObject, UsuarioRentado: { id: undefined } })
    await expect(service.save(newMockObject)).rejects.toThrowError(UserIdNotDefinedError)
})


test('save se ejecuta correctamente con rentRepository.save una vez', async () => {


    await service.save(mockObject)
    expect(rentRepository.save).toHaveBeenCalledTimes(1)
    expect(rentRepository.save).toHaveBeenCalledWith(mockObject)
})

test('remove devuelve error al no pasarle parametro id', async () => {
    await expect(service.remove).rejects.toThrowError(RentIdNotDefinedError)
})

test('remove llama a repositorio.remove una vez', async () => {
    const ID_PRUEBA = 1
    await service.remove(ID_PRUEBA)
    expect(rentRepository.remove).toHaveBeenCalledTimes(1)
    expect(rentRepository.remove).toHaveBeenCalledWith(ID_PRUEBA)
})

test('getSelectedRent devuelve error al no pasarle parametro id', async () => {
    await expect(service.getSelectedRent).rejects.toThrowError(RentIdNotDefinedError)
})

test('GetSelectedRent llama a rentRepository.getSelectedRent una vez', async () => {
    const ID_PRUEBA = 1
    await service.getSelectedRent(ID_PRUEBA)
    expect(rentRepository.getSelectedRent).toHaveBeenCalledTimes(1)
    expect(rentRepository.getSelectedRent).toHaveBeenCalledWith(ID_PRUEBA)
})





