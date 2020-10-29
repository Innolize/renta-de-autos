const RentRepository = require('../rentRepository')
const { Sequelize } = require('sequelize')
const RentIdNotDefinedError = require('../error/rentIdNotDefinedError')

const CarEntity = require('../../../cars/entity/Car')
const UserEntity = require('../../../users/entity/User')
const RentEntity = require('../../entity/Rent')

const rentModel = require('../../model/rentModel')
const carModel = require('../../../cars/model/carModel')
const userModel = require('../../../users/model/userModel')


const sequelizeInstance = new Sequelize('sqlite::memory')

let car
let user
let rent
let repository

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

const sampleCar = new CarEntity({
    marca: "Volkswagen",
    modelo: "Passat",
    año: 2015,
    kilometraje: 110000,
    color: 'Gris',
    aireAcondicionado: true,
    pasajeros: 4,
    cajaCambios: "manual",
    precio: 200,
    imagen: '/uploads/carsDefault/volkswagen-passat.jpg'
})

const sampleRent = new RentEntity({
    rentaInicio: "2020-05-05",
    rentaTermina: "2020-05-09",
    precioDia: undefined,
    precioTotal: undefined,
    formaPago: "efectivo",
    abonado: true,
    AutoRentado: { id: 1 },
    UsuarioRentado: { id: 1 }
})

beforeAll(() => {
    car = carModel.setup(sequelizeInstance)
    user = userModel.setup(sequelizeInstance)
    rent = rentModel.setup(sequelizeInstance)
    rent.setupCarAssociation(car)
    rent.setupUserAssociation(user)

    repository = new RentRepository(car, user, rent)
})

beforeEach(async (done) => {
    await sequelizeInstance.sync({ force: true })
    done()
})

test('save guarda renta con usuario y auto existente', async () => {
    const newUser = await user.create(sampleUser)
    const newCar = await car.create(sampleCar)
    const newRent = await repository.save(sampleRent)


    const response = await repository.getData()
    console.log(response)
    expect(response).toHaveLength(1)
})

test('save devuelve error al querer guardar renta con auto inexistente', async () => {
    const newCar = await car.create(sampleCar)
    await expect(repository.save(sampleRent)).rejects.toThrowError(Error)
})

test('save devuelve error al querer guardar renta con usuario inexistente', async () => {
    const newUser = await user.create(sampleUser)
    await expect(repository.save(sampleRent)).rejects.toThrowError(Error)
})

test('save devuelve error al tener conflicto de fechas con otra renta', async () => {
    const newUser = await user.create(sampleUser)
    const newCar = await car.create(sampleCar)

    const sampleRentError = new RentEntity({
        rentaInicio: "2020-05-06",
        rentaTermina: "2020-05-10",
        precioDia: undefined,
        precioTotal: undefined,
        formaPago: "efectivo",
        abonado: true,
        AutoRentado: { id: 1 },
        UsuarioRentado: { id: 1 }
    })

    await repository.save(sampleRent)


    await expect(repository.save(sampleRentError)).rejects.toThrowError(Error)
})

test('save devuelve error al querer guardar renta con usuario inexistente', async () => {
    const newUser = await user.create(sampleUser)
    const response = await repository.remove(1)
    expect(response).toBe(false)
})

test('remove devuelve error al no pasarle id', async () => {
    await expect(repository.remove).rejects.toThrowError(RentIdNotDefinedError)
})

test('getSelectedRent devuelve error al no pasarle id', async () => {
    await expect(repository.getSelectedRent).rejects.toThrowError(RentIdNotDefinedError)
})

