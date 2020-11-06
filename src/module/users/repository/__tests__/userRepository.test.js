const { Sequelize } = require('sequelize')
const UserEntity = require('../../entity/User')
const UserModel = require('../../model/userModel')
const UserRepository = require('../userRepository')
const UserIdNotDefinedError = require('../error/userIdNotDefinedError')
const UserNotFoundError = require('../error/userNotFoundError')
const UserNotDefinedError = require('../error/userNotDefinedError')

const sequelizeInstance = new Sequelize('sqlite::memory')

let repository;
let user

const sampleUser = new UserEntity({
    nombre: "Carlitos",
    apellido: "Test",
    tipoDocumento: "DNI",
    numeroDocumento: "35945234",
    nacionalidad: "Argentina",
    direccion: "direccionTest 352",
    telefono: 45674321,
    email: "test123@yahoo.com",
    nacimiento: "1990-05-05"
})

const sampleUser2 = new UserEntity({
    nombre: "Pedrito",
    apellido: "Test",
    tipoDocumento: "DNI",
    numeroDocumento: "35945234",
    nacionalidad: "Argentina",
    direccion: "direccionTest 352",
    telefono: 45674321,
    email: "test123@yahoo.com",
    nacimiento: "1990-05-05"
})

beforeAll(() => {
    user = UserModel.setup(sequelizeInstance)
    repository = new UserRepository(user)
})

beforeEach(async (done) => {
    await sequelizeInstance.sync({ force: true })
    done()
})

test('Save un usuario cuando la entidad no tiene id', async () => {
    const ID_ASIGNADO_AUTOMATICAMENTE = 1
    const newUser = await repository.save(sampleUser)
    expect(newUser.id).toEqual(ID_ASIGNADO_AUTOMATICAMENTE)
})

test('Save devuelve error al no pasarle parametros', async () => {
    await expect(repository.save()).rejects.toThrowError(UserNotDefinedError)
})

test('Inserta 2 usuarios a la base de datos y luego los llama con getData', async () => {
    await repository.save(sampleUser)
    await repository.save(sampleUser2)

    const resultado = await repository.getAll()
    expect(resultado).toHaveLength(2)
})

test('getById devuelve error al no pasarle id', async () => {
    await expect(repository.getById()).rejects.toThrowError(UserIdNotDefinedError)
})

test('getById devuelve un usuario con el id especificado', async () => {
    const ID_ASIGNADO_AUTOMATICAMENTE = 1
    await repository.save(sampleUser)
    const newUser = await repository.getById(ID_ASIGNADO_AUTOMATICAMENTE)
    expect(newUser.id).toEqual(ID_ASIGNADO_AUTOMATICAMENTE)
})

test('getById no encuentra usuario con el id especificado', async () => {
    const ID_INEXISTENTE = 5
    await repository.save(sampleUser)
    await expect(repository.getById(ID_INEXISTENTE)).rejects.toThrowError(UserNotFoundError)
})

test('remove devuelve error al no pasarle id', async () => {
    await expect(repository.remove()).rejects.toThrowError(UserIdNotDefinedError)
})

test('remove encuentre y elimina un usuario devolviendo true', async () => {
    const ID_ASIGNADO_AUTOMATICAMENTE = 1
    const newUser = await repository.save(sampleUser)
    const respuesta = await repository.remove(1)
    expect(respuesta).toEqual(true)
})


