const UserIdNotDefinedError = require('../error/userIdNotDefinedError');
const UserController = require('../userController')

afterEach(() => {
    jest.clearAllMocks();
});

const mockMiddleware = {
    none: jest.fn()
}
const mockService = {
    getData: jest.fn(() => Promise.resolve([])),
    getById: jest.fn(() => Promise.resolve({})),
    save: jest.fn(() => Promise.resolve({ id: 5 })),
    remove: jest.fn(() => Promise.resolve({ id: 5 }))
}

const Controller = new UserController(mockMiddleware, mockService)

test('configureRoutes llama a app.get 5 veces y app.post 2 veces ', () => {
    const appMock = {
        get: jest.fn(),
        post: jest.fn()
    }
    Controller.configureRoutes(appMock)
    expect(appMock.get).toHaveBeenCalledTimes(5)
    expect(appMock.post).toHaveBeenCalledTimes(2)
})


test('index renderea indexl con users, messages y errors ', async () => {
    const renderMock = jest.fn()

    await Controller.index({ session: { messages: [], errors: [] } }, { render: renderMock })
    expect(mockService.getData).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith(
        'users/view/index.html',
        { users: [], messages: [], errors: [] }
    )
})

test('view da error al no pasarle id', async () => {
    await expect(Controller.view({ params: {} })).rejects.toThrowError(UserIdNotDefinedError)
})

test('view renderea view.html ', async () => {
    const renderMock = jest.fn()
    await Controller.view({ params: { id: 5 } }, { render: renderMock })
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith(
        'users/view/view.html',
        { user: {} }
    )
})

test('view redirecciona a /user si falla getById', async () => {
    const redirectMock = jest.fn()
    mockService.getById.mockImplementationOnce(() => Promise.reject(new Error('fail')))

    await Controller.view({ params: { id: 5 }, session: {} }, { redirect: redirectMock })
    expect(mockService.getById).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/user")
})

test('save redirecciona a /user con usuario editado', async () => {
    const redirectMock = jest.fn()
    const sessionMock = {}
    const bodyMock =
    {
        id: 5,
        nombre: "Carlitos",
        apellido: "Test",
        "tipo-documento": "DNI",
        "numero-documento": "35945234",
        nacionalidad: "Argentina",
        direccion: "direccionTest 352",
        telefono: 45674321,
        email: "test123@yahoo.com",
        "fecha-nacimiento": "1990-05-05"
    }
    await Controller.save({ body: bodyMock, session: sessionMock }, { redirect: redirectMock })
    expect(mockService.save).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/user")
    expect(sessionMock.messages).toEqual([`El usuario con id 5 se actualizó con éxito`])
})

test('save redirecciona a /user con usuario creado', async () => {
    const redirectMock = jest.fn()
    const sessionMock = {}
    mockService.save.mockImplementationOnce(() => Promise.resolve({ id: 5 }))
    const bodyMock =
    {
        nombre: "Carlitos",
        apellido: "Test",
        "tipo-documento": "DNI",
        "numero-documento": "35945234",
        nacionalidad: "Argentina",
        direccion: "direccionTest 352",
        telefono: 45674321,
        email: "test123@yahoo.com",
        "fecha-nacimiento": "1990-05-05"
    }
    await Controller.save({ body: bodyMock, session: sessionMock }, { redirect: redirectMock })
    expect(mockService.save).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/user")
    expect(sessionMock.messages).toEqual([`El usuario con id 5 se creó con éxito`])
})

test('save redirecciona a /user con usuario creado', async () => {
    const redirectMock = jest.fn()
    const sessionMock = {}
    mockService.save.mockImplementationOnce(() => Promise.reject(new Error("error")))

    const bodyMock = {
        nombre: "Carlitos",
        apellido: "Test",
        "tipo-documento": "DNI",
        "numero-documento": "35945234",
        nacionalidad: "Argentina",
        direccion: "direccionTest 352",
        telefono: 45674321,
        email: "test123@yahoo.com",
        "fecha-nacimiento": "1990-05-05"
    }

    await Controller.save({ body: bodyMock, session: sessionMock }, { redirect: redirectMock })
    expect(sessionMock.errors).toEqual(["error"])
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/user")
})

test('create renderiza form', () => {
    renderMock = jest.fn()
    Controller.create({}, { render: renderMock })
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("users/view/form.html")
})

test("edit da error al no pasar un id", async () => {
    const paramsMock = {}

    await expect(Controller.edit({ params: paramsMock })).rejects.toThrowError(UserIdNotDefinedError)
})

test('edit renderea form.html', async () => {
    const renderMock = jest.fn()
    await Controller.edit({ params: { id: 5 } }, { render: renderMock })
    expect(mockService.getById).toHaveBeenCalledTimes(1)
    expect(mockService.getById).toHaveBeenCalledWith(5)
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith('users/view/form.html', { user: {} })
})

test('edit da error y redirecciona a /user', async () => {
    mockService.getById.mockImplementationOnce(() => Promise.reject(new Error("test")))
    const sessionMock = {}
    const redirectMock = jest.fn()

    await Controller.edit({ params: { id: 5 }, session: sessionMock }, { redirect: redirectMock })
    expect(mockService.getById).toHaveBeenCalledTimes(1)
    expect(sessionMock.errors).toHaveLength(1)
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/user")
})

test('removeConfirmation da error al no pasar id', async () => {
    const paramsMock = {}
    await expect(Controller.removeConfirmation({ params: paramsMock })).rejects.toThrowError(UserIdNotDefinedError)
})

test('removeConfirmation renderea delete.html con info de user', async () => {
    const paramsMock = { id: 5 }
    const renderMock = jest.fn()
    await Controller.removeConfirmation({ params: paramsMock }, { render: renderMock })
    expect(mockService.getById).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith('users/view/delete.html', { user: {} })
})

test('removeConfirmation devuelve error y redirecciona a /user ', async () => {
    mockService.getById.mockImplementationOnce(() => Promise.reject(new Error("test")))
    const paramsMock = { id: 5 }
    const redirectMock = jest.fn()
    const sessionMock = {}

    await Controller.removeConfirmation({ params: paramsMock, session: sessionMock }, { redirect: redirectMock })
    expect(sessionMock.errors).toHaveLength(1)
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith('/user')
})

test('remove devuelve error al no pasar id ', async () => {
    const paramsMock = {}
    await expect(Controller.remove({ params: paramsMock })).rejects.toThrowError(UserIdNotDefinedError)
})

test('remove redirecciona a /user con mensaje de exito', async () => {
    const paramsMock = { id: 5 }
    const sessionMock = {}
    const redirectMock = jest.fn()
    await Controller.remove({ params: paramsMock, session: sessionMock }, { redirect: redirectMock })
    expect(mockService.remove).toHaveBeenCalledTimes(1)
    expect(mockService.remove).toHaveBeenCalledWith(5)
    expect(sessionMock.messages).toEqual(['El usuario con id 5 se ha eliminado'])
})

test('remove redirecciona a /user con mensaje de exito', async () => {
    mockService.remove.mockImplementationOnce(() => Promise.reject(new Error("test")))
    const paramsMock = { id: 5 }
    const sessionMock = {}
    const redirectMock = jest.fn()
    await Controller.remove({ params: paramsMock, session: sessionMock }, { redirect: redirectMock })
    expect(mockService.remove).toHaveBeenCalledTimes(1)
    expect(mockService.remove).toHaveBeenCalledWith(5)
    expect(sessionMock.errors).toEqual(['No se pudo eliminar el usuario con id 5'])
})

