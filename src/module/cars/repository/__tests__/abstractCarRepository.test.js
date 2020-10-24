const AbstractCarRepositoryError = require('../error/abstractCarRepositoryError')
const AbstractCarRepository = require('../abstractCarRepository')

test('Crea instancia de AbstractRepository devolviendo error ', () => {
    try {
        new AbstractCarRepository()
    } catch (e) {
        expect(e).toBeInstanceOf(AbstractCarRepositoryError)
    }
})

test('Se puede crear una nueva instancia de una clase que hereda de AbstractController', () => {
    const ConcreteController = class extends AbstractCarRepository { }
    expect(new ConcreteController()).toBeInstanceOf(AbstractCarRepository)
})