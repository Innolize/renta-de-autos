const AbstractController = require('../abstractController')
const AbstractControllerError = require('../error/abstractControllerError')

test('Crea instancia de AbstractController dando error', () => {
    try {
        new AbstractController()
    } catch (e) {
        expect(e).toBeInstanceOf(AbstractControllerError)
    }
})

test('Se puede crear una nueva instancia de una clase que hereda de AbstractController', () => {
    const ConcreteController = class extends AbstractController { }
    expect(new ConcreteController()).toBeInstanceOf(AbstractController)
})