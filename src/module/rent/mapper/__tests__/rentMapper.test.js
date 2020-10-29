const { fromDbToEntity } = require('../rentMapper')
const RentEntity = require('../../entity/Rent')

test('Convierte un modelo a una entidad', () => {
    expect(fromDbToEntity({ toJSON() { return {} } })).toBeInstanceOf(RentEntity)
})
