const { fromDbToEntity, fromFormToEntity } = require('../carMapper')
const carEntity = require('../../entity/Car')

test('fromDBtoEntity devuelve una entidad de tipo Car', () => {
    expect(
        fromDbToEntity({
            toJSON() {
                return {}
            },
        })
    ).toBeInstanceOf(carEntity)
})

test('Testea fromFormToEntity aireAcondicionado en pasando "true"', () => {
    const objetoEjemplo = {
        marca: "tesla",
        modelo: "S",
        año: "2017",
        kilometraje: "40000",
        color: 'Rojo',
        "aire-acondicionado": "true",
        pasajeros: "4",
        "caja-cambios": "automatico",
        imagen: '/uploads/carsDefault/tesla-s.jpg'
    }
    const newCar = fromFormToEntity(objetoEjemplo)
    expect(newCar.aireAcondicionado).toEqual(true)

})