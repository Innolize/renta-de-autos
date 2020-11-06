const RentRepository = require('../rentRepository')
const { Sequelize } = require('sequelize')
const RentIdNotDefinedError = require('../error/rentIdNotDefinedError')

const CarEntity = require('../../../cars/entity/Car')
const UserEntity = require('../../../users/entity/User')
const RentEntity = require('../../entity/Rent')

const rentModel = require('../../model/rentModel')
const carModel = require('../../../cars/model/carModel')
const userModel = require('../../../users/model/userModel')
const BookingConflictError = require('../error/bookingConflictError')
const NonExistentCarError = require('../error/nonExistentCarError')
const NonExistentUserError = require('../error/nonExistentUserError')


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
    precioDia: 100,
    precioTotal: 400,
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


    const response = await repository.getAll()
    console.log(response)
    expect(response).toHaveLength(1)
})

test('save devuelve error al querer guardar renta con auto inexistente', async () => {
    const newCar = await car.create(sampleCar)
    await expect(repository.save(sampleRent)).rejects.toThrowError(Error)
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

test('getSelectedRent devuelve renta incluyendo usuario y auto', async () => {

    const newUser = await user.create(sampleUser)
    const newCar = await car.create(sampleCar)
    const newRent = await repository.save(sampleRent)

    const resultado = await repository.getSelectedRent(1)
    expect(resultado.AutoRentado.marca).toEqual(sampleCar.marca)
    expect(resultado.AutoRentado.modelo).toEqual(sampleCar.modelo)

    expect(resultado.UsuarioRentado.nombre).toEqual(sampleUser.nombre)
    expect(resultado.UsuarioRentado.apellido).toEqual(sampleUser.apellido)
})

test('Verifica superposicion de rentas sin devolver error', async () => {
    const newUser = await user.create(sampleUser)
    const newCar = await car.create(sampleCar)
    const newRent = await repository.save(sampleRent)
    const newRent2 = await repository.getCarOrUserBookingBetweenDates({ ...sampleRent, rentaInicio: "2020-05-10", rentaTermina: "2020-05-12" })
})

test('Verifica superposicion de rentas devolviendo error', async () => {
    const newUser = await user.create(sampleUser)
    const newCar = await car.create(sampleCar)
    const newRent = await repository.save(sampleRent)
    await expect(repository.getCarOrUserBookingBetweenDates(sampleRent)).rejects.toThrowError(BookingConflictError)
})

test('validateCarAndUserExistence valida que usuario y auto pasado como parametro existan y devuelve dicho usuario y auto', async () => {
    const newUser = await user.create(sampleUser)
    const newCar = await car.create(sampleCar)
    const resultado = await repository.validateCarAndUserExistence(newUser.id, newCar.id)
    expect(resultado.car).toBeInstanceOf(CarEntity)
    expect(resultado.user).toBeInstanceOf(UserEntity)
})

test('Devuelve error al pasarle el id de un auto que no inexistente', async () => {
    const newUser = await user.create(sampleUser)
    const newCar = await car.create(sampleCar)
    await expect(repository.validateCarAndUserExistence(5, 1)).rejects.toThrowError(NonExistentCarError)
})

test('Devuelve error al pasarle el id de un usuario que no inexistente', async () => {
    const newUser = await user.create(sampleUser)
    const newCar = await car.create(sampleCar)
    await expect(repository.validateCarAndUserExistence(1, 5)).rejects.toThrowError(NonExistentUserError)
})