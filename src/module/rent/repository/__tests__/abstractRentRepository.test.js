const AbstractRentRepository = require('../abstractRentRepository')
const AbstractRentRepositoryError = require('../error/abstractRentRepositoryError')

test('No se puede instanciar un repositorio abstract', () => {

    try {
        new AbstractRentRepository()
    } catch (e) {
        expect(e).toBeInstanceOf(AbstractRentRepositoryError)
    }

})
