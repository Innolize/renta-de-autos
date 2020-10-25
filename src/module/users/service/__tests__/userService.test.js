const UserIdNotDefinedError = require('../../controller/error/userIdNotDefinedError')
const UserNotDefinedError = require('../../controller/error/userNotDefinedError')
const UserService = require('../userService')

const mockRepository = {
    getData: jest.fn(),
    getById: jest.fn(),
    remove: jest.fn(),
    save: jest.fn()
}

const service = new UserService(mockRepository)

test('Llama a getData del mockRepository una vez', async () => {
    await service.getData()
    expect(mockRepository.getData).toHaveBeenCalledTimes(1)
})


test('Llama a getById del mockRepository una vez con parametro', async () => {
    await service.getById(5)
    expect(mockRepository.getById).toHaveBeenCalledTimes(1)
    expect(mockRepository.getById).toHaveBeenCalledWith(5)
})

test('getById da error al no pasarle un id', async () => {
    await expect(service.getById()).rejects.toThrowError(UserIdNotDefinedError)
})


test('Llama a remove del mockRepository una vez con parametro', async () => {
    await service.remove(5)
    expect(mockRepository.remove).toHaveBeenCalledTimes(1)
    expect(mockRepository.remove).toHaveBeenCalledWith(5)
})

test('remove da error al no pasarle un id', async () => {
    await expect(service.remove()).rejects.toThrowError(UserIdNotDefinedError)
})

test('Llama a save del mockRepository una vez con usuario', async () => {
    const usuarioMock = {
        nombre: "testNombre",
        apellido: "testApellido"
    }
    await service.save(usuarioMock)
    expect(mockRepository.save).toHaveBeenCalledTimes(1)
    expect(mockRepository.save).toHaveBeenCalledWith(usuarioMock)
})

test('save da error al no pasarle un usuario', async () => {
    await expect(service.save()).rejects.toThrowError(UserNotDefinedError)
})