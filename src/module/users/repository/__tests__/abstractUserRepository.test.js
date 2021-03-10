const AbstractUserRepository = require('../abstractUserRepository')
const AbstractUserRepositoryError = require('../error/abstractUserRepositoryError')

test('AbstractUserRepository no puede crear una instancia de si mismo', () => {
    try {
        new AbstractUserRepository()
    } catch (e) {
        expect(e).toBeInstanceOf(AbstractUserRepositoryError)
    }
})
