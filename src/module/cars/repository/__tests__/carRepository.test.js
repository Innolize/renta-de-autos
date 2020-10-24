const { Sequelize } = require('sequelize')
const CarEntity = require('../../entity/Car')
const CarModel = require('../../model/carModel')
const CarRepository = require('../carRepository')
const CarNotFoundError = require('../error/carNotFoundError')
const CarIdNotDefinedError = require('../error/carIdNotDefinedError')

const sequelizeInstance = new Sequelize('sqlite::memory')

let repository;

const sampleCar = new CarEntity({
    marca: "Volkswagen",
    modelo: "Passat",
    año: 2015,
    kilometraje: 110000,
    color: 'Gris',
    aireAcondicionado: true,
    pasajeros: 4,
    cajaCambios: "manual",
    imagen: '/uploads/carsDefault/volkswagen-passat.jpg'
})

const sampleCar2 = new CarEntity({
    marca: "tesla",
    modelo: "S",
    año: 2017,
    kilometraje: 40000,
    color: 'Rojo',
    aireAcondicionado: true,
    pasajeros: 4,
    cajaCambios: "automatico",
    imagen: '/uploads/carsDefault/tesla-s.jpg'
})

beforeAll(() => {
    const car = CarModel.setup(sequelizeInstance)

    repository = new CarRepository(car)
})

beforeEach(async (done) => {
    await sequelizeInstance.sync({ force: true });
    done();
});

//tests

test('Crea un auto cuando la entidad no tiene id', async () => {
    const ID_ASIGNADO_AUTOMATICAMENTE = 1
    const newCar = await repository.save(sampleCar)
    expect(newCar.id).toEqual(ID_ASIGNADO_AUTOMATICAMENTE)
})

test('Actualiza un auto cuando la entidad tiene un id', async () => {
    const ID_ASIGNADO_AUTOMATICAMENTE = 1
    const newCar = await repository.save(sampleCar)
    expect(newCar.id).toEqual(ID_ASIGNADO_AUTOMATICAMENTE)

    newCar.modelo = 'virtus'
    const modifiedCar = await repository.save(newCar)
    expect(modifiedCar.id).toEqual(ID_ASIGNADO_AUTOMATICAMENTE)
    expect(modifiedCar.modelo).toEqual('virtus')
})

test('Elimina un auto y devuelve true', async () => {
    const ID_ASIGNADO_AUTOMATICAMENTE = 1
    const newCar = await repository.save(sampleCar)
    expect(newCar.id).toEqual(ID_ASIGNADO_AUTOMATICAMENTE)

    await expect(repository.remove(ID_ASIGNADO_AUTOMATICAMENTE)).resolves.toEqual(true)
    await expect(repository.getById(ID_ASIGNADO_AUTOMATICAMENTE)).rejects.toThrowError(CarNotFoundError)
})

test('Inserta 2 autos a la base de datos y luego los llama con getData', async () => {
    await repository.save(sampleCar)
    await repository.save(sampleCar2)

    const resultado = await repository.getData()
    expect(resultado).toHaveLength(2)
})

test('Guardar sin parametro devuelve error', async () => {
    await expect(repository.save()).rejects.toThrowError(CarNotFoundError)
})

test('Busca un auto por id que no existe', async () => {
    await expect(repository.getById(124324)).rejects.toThrowError(CarNotFoundError)
})

test('Intenta eliminar un auto sin enviar id', async () => {
    await expect(repository.remove()).rejects.toThrowError(CarIdNotDefinedError)
})