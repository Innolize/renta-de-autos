const RentController = require('../rentController')
const RentIdNotDefinedError = require('../error/rentIdNotDefinedError');
const { render } = require('nunjucks');
const session = require('express-session');

afterEach(() => {
    jest.clearAllMocks();
});

const uploadMiddleware = {
    none: jest.fn()
}

const rentService = {
    getAll: jest.fn(() => Promise.resolve([])),

    save: jest.fn(() => Promise.resolve({ id: 5 })),
    remove: jest.fn(() => Promise.resolve(true)),
    getSelectedRent: jest.fn(() => Promise.resolve([1])),
}

const carService = {
    getAll: jest.fn(() => Promise.resolve([1])),
}
const userService = {
    getAll: jest.fn(() => Promise.resolve([1])),
}

const sessionMock = {}
const redirectMock = jest.fn()
const renderMock = jest.fn()


const controller = new RentController(uploadMiddleware, rentService, carService, userService)

test('Configure routes llama a ', () => {
    const app = {
        get: jest.fn(),
        post: jest.fn(),
    }

    controller.configureRoutes(app)

    expect(app.get).toHaveBeenCalledTimes(4)
    expect(app.post).toHaveBeenCalledTimes(2)
})

test('renderea index con mensajes en session ', async () => {
    const sessionMock = {
        errors: ['error test'],
        messages: ['messages test']
    }

    const renderMock = jest.fn()

    await controller.index({ session: sessionMock }, { render: renderMock })

    expect(rentService.getAll).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith('rent/view/index.html', { rents: [], errors: ['error test'], messages: ['messages test'] })
})

test('renderea form con users y cars', async () => {
    const renderMock = jest.fn()

    await controller.form({}, { render: renderMock })

    expect(userService.getAll).toHaveBeenCalledTimes(1)
    expect(carService.getAll).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith('rent/view/form.html', { users: [1], cars: [1] })
})

test('form al no tener usuarios devuelve error en session y redirecciona a /rent', async () => {
    userService.getAll.mockImplementationOnce(() => Promise.resolve([]))
    const sessionMock = {}
    const redirectMock = jest.fn()
    const renderMock = jest.fn()

    await controller.form({ session: sessionMock }, { redirect: redirectMock, render: renderMock })

    expect(userService.getAll).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledTimes(0)
    expect(sessionMock).toEqual({ errors: [`No se puede crear una renta sin usuarios en la base de datos`] })
})

test('form al no tener vehiculos devuelve error en session y redirecciona a /rent', async () => {
    carService.getAll.mockImplementationOnce(() => Promise.resolve([]))

    await controller.form({ session: sessionMock }, { redirect: redirectMock, render: renderMock })

    expect(userService.getAll).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledTimes(0)
    expect(sessionMock).toEqual({ errors: [`No se puede crear una renta sin vehiculos en la base de datos`] })
})

test('view devuelve error al no pasarle el parametro id', async () => {

    await expect(controller.view({ params: {}, session: {} }, { redirect: redirectMock })).rejects.toThrowError(RentIdNotDefinedError)
})

test('view renderea vista con parametro rent', async () => {
    await controller.view({ params: { id: 1 } }, { render: renderMock, redirect: redirectMock })
    expect(rentService.getSelectedRent).toHaveBeenCalledTimes(1)
    expect(rentService.getSelectedRent).toHaveBeenCalledWith(1)
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith('rent/view/view.html', { rent: [1] })
})

test('view al fallar en traer el vehiculo seleccionado redirecciona a /rent con error', async () => {
    rentService.getSelectedRent.mockImplementationOnce(() => Promise.reject(new Error('fail')))

    await controller.view({ params: { id: 1 }, session: sessionMock }, { render: renderMock, redirect: redirectMock })
    expect(rentService.getSelectedRent).toHaveBeenCalledTimes(1)
    expect(rentService.getSelectedRent).toHaveBeenCalledWith(1)
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith('/rent')
    expect(sessionMock.errors).toEqual(['fail'])
})

test('save guarda equipo sin id devolviendo mensaje', async () => {
    await controller.save({ body: { id: 1 }, session: sessionMock }, { redirect: redirectMock })
    expect(sessionMock.messages).toEqual([`Se actualizo renta con id 1`])
})

test('save guarda equipo sin id devolviendo mensaje', async () => {
    await controller.save({ body: {}, session: sessionMock }, { redirect: redirectMock })
    expect(sessionMock.messages).toEqual([`Se creo renta con id 5`])
})

test('save devuelve error al guardar, muestra guarda error en sesion y redirecciona', async () => {
    rentService.save.mockImplementationOnce(() => Promise.reject(new Error('fail')))
    await controller.save({ body: { id: 1 }, session: sessionMock }, { redirect: redirectMock })
    expect(sessionMock.errors).toEqual([`fail`])
    expect(redirectMock).toHaveBeenCalledTimes(1)
})

test('edit devuelve error al no pasarle id en parametros ', async () => {
    await expect(controller.edit({ params: {}, session: {} }, { redirect: redirectMock })).rejects.toThrowError(RentIdNotDefinedError)
})

test('edit renderea form con rent, users y cars ', async () => {
    userService.getAll.mockImplementationOnce(() => Promise.resolve([1]))
    carService.getAll.mockImplementationOnce(() => Promise.resolve([1]))
    await controller.edit({ params: { id: 1 }, session: sessionMock }, { redirect: redirectMock, render: renderMock })
    expect(userService.getAll).toHaveBeenCalledTimes(1)
    expect(carService.getAll).toHaveBeenCalledTimes(1)
    expect(rentService.getSelectedRent).toHaveBeenCalledTimes(1)
    expect(rentService.getSelectedRent).toHaveBeenCalledWith(1)
})

test('edit redirecciona a /rent con mensaje de error al no haber usuarios ', async () => {
    userService.getAll.mockImplementationOnce(() => Promise.resolve([]))
    await controller.edit({ params: { id: 1 }, session: sessionMock }, { redirect: redirectMock, render: renderMock })
    expect(userService.getAll).toHaveBeenCalledTimes(1)
    expect(sessionMock.errors).toEqual([`No se puede editar una renta sin usuarios en la base de datos`])
    expect(carService.getAll).toHaveBeenCalledTimes(0)
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith('/rent')
})

test('edit renderea form con rent, users y cars ', async () => {
    carService.getAll.mockImplementationOnce(() => Promise.resolve([]))
    await controller.edit({ params: { id: 1 }, session: sessionMock }, { redirect: redirectMock, render: renderMock })
    expect(userService.getAll).toHaveBeenCalledTimes(1)
    expect(carService.getAll).toHaveBeenCalledTimes(1)
    expect(sessionMock.errors).toEqual([`No se puede editar una renta sin vehiculos en la base de datos`])
})

test('remove devuelve error al no pasarle parametro id ', async () => {
    await expect(controller.remove({ params: {}, session: {} }, { redirect: redirectMock })).rejects.toThrowError(RentIdNotDefinedError)
})

test('remove elimina con exito, guarda mensaje en session y redirecciona a /rent', async () => {
    await controller.remove({ params: { id: 5 }, session: sessionMock }, { redirect: redirectMock })
    expect(rentService.remove).toHaveBeenCalledTimes(1)
    expect(rentService.remove).toHaveBeenCalledWith(5)
    expect(sessionMock.messages).toEqual([`La renta con id 5 se elimino con exito`])
})


test('remove pone error en session cuando rentService.remove da error ', async () => {
    rentService.remove.mockImplementationOnce(() => Promise.reject(new Error('fail')))
    await controller.remove({ params: { id: 5 }, session: sessionMock }, { redirect: redirectMock })
    expect(rentService.remove).toHaveBeenCalledTimes(1)
    expect(sessionMock.errors).toEqual(['fail'])
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith('/rent')
})



