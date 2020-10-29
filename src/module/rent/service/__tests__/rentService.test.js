const RentService = require('../rentService')
const RentNotDefinedError = require('../error/rentNotDefinedError')
const RentIdNotDefinedError = require('../error/rentIdNotDefinedError')
const RentEntity = require('../../entity/Rent')
const Repository = require('../../../cars/repository/carRepository')

const rentRepository = {
    getData: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    getSelectedRent: jest.fn()
}

const service = new RentService(rentRepository)

test('getData llama a rentRepository.getData una vez', async () => {
    await service.getData()
    expect(rentRepository.getData).toHaveBeenCalledTimes(1)
})

test('save devuelve error al no pasarle rent', async () => {
    await expect(service.save).rejects.toThrowError(RentNotDefinedError)
})

test('save se ejecuta correctamente con rentRepository.save una vez', async () => {
    const mockObject = new RentEntity({
        id: 1,
        rentaInicio: "2020-05-05",
        rentaTermina: "2020-05-09",
        precioDia: 100,
        precioTotal: 400,
        formaPago: "efectivo",
        abonado: true,
        fk_auto: 2,
        fk_usuario: 1,
    })

    await service.save(mockObject)
    expect(rentRepository.save).toHaveBeenCalledTimes(1)
    expect(rentRepository.save).toHaveBeenCalledWith(mockObject)
})

test('remove devuelve error al no pasarle parametro id', async () => {
    await expect(service.remove).rejects.toThrowError(RentIdNotDefinedError)
})

test('remove llama a repositorio.remove una vez', async () => {
    const ID_PRUEBA = 1
    await rentRepository.remove(ID_PRUEBA)
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





