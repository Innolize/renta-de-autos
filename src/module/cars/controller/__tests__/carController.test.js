const CarController = require('../carController')
const Car = require('../../entity/Car')
const CarIdNotDefinedError = require('../../repository/error/carIdNotDefinedError')

afterEach(() => {
    jest.clearAllMocks();
});

const serviceMock = {
    getAll: jest.fn(() => Promise.resolve([])),
    save: jest.fn(() => Promise.resolve(true)),
    getById: jest.fn(() => Promise.resolve({})),
    remove: jest.fn(() => Promise.resolve({}))
}

const middlewareMock = {
    single: () => { }
}

const controller = new CarController(middlewareMock, serviceMock)

test("index renderea index.html", async () => {
    const renderMock = jest.fn()
    await controller.index({ session: { errors: [], messages: [] } }, { render: renderMock })
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("cars/view/index.html", {
        cars: [],
        messages: [],
        errors: []
    })
})

test('form renderea form.html', () => {
    const renderMock = jest.fn()
    controller.form({}, { render: renderMock })
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("cars/view/form.html")
})

test('save llama al servicio con el body y redirecciona a /car', async () => {
    const redirectMock = jest.fn()
    const fakeImage = "test"
    const sessionMock = {}
    const bodyMock = new Car({
        id: 37,
        marca: undefined,
        modelo: undefined,
        año: NaN,
        kilometraje: NaN,
        color: undefined,
        aireAcondicionado: false,
        pasajeros: NaN,
        cajaCambios: undefined,
        imagen: "/uploads/cars/test"
    })

    await controller.save({ body: bodyMock, file: { filename: fakeImage }, session: sessionMock }, { redirect: redirectMock })
    expect(serviceMock.save).toHaveBeenCalledTimes(1)
    expect(serviceMock.save).toHaveBeenCalledWith(bodyMock)
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/car")
    expect(sessionMock.messages).toEqual([`El auto con id 37 se actualizo con exito`])
})


test('save llama al servicio con el body sin id', async () => {
    const redirectMock = jest.fn()
    const fakeImage = "test"
    const sessionMock = {}
    const bodyMock = new Car({
        id: undefined,
        marca: undefined,
        modelo: undefined,
        año: NaN,
        kilometraje: NaN,
        color: undefined,
        aireAcondicionado: false,
        pasajeros: NaN,
        cajaCambios: undefined,
        imagen: "/uploads/cars/test"
    })

    await controller.save({ body: bodyMock, file: { filename: fakeImage }, session: sessionMock }, { redirect: redirectMock })
    expect(serviceMock.save).toHaveBeenCalledTimes(1)
    expect(serviceMock.save).toHaveBeenCalledWith(bodyMock)
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/car")
    expect(sessionMock.messages).toEqual([`Se creo nuevo auto con id undefined`])
})




test("view llama al servicio con un id y renderea view.html", async () => {
    const renderMock = jest.fn()
    const fakeId = 5

    await controller.view({ params: { id: fakeId } }, { render: renderMock })
    expect(serviceMock.getById).toHaveBeenCalledTimes(1)
    expect(serviceMock.getById).toHaveBeenCalledWith(5)
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("cars/view/view.html", { car: {} })
})

test("view tira error al no pasarle un id", async () => {
    await expect(controller.view({ params: {} }, {})).rejects.toThrowError(CarIdNotDefinedError)
})

test("view entra en el catch", async () => {
    const redirectMock = jest.fn()
    const fakeId = 5
    const sessionMock = {}
    serviceMock.getById.mockImplementationOnce(() => Promise.reject(new Error('fail')))

    await controller.view({ params: { id: fakeId }, session: sessionMock }, { redirect: redirectMock })
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/car")
    expect(sessionMock).toEqual({ messages: ["fail"] })
})

test("edit da error si no se le pasa id", async () => {
    await expect(controller.edit({ params: {} }, {})).rejects.toThrowError(CarIdNotDefinedError)
})

test('edit renderea form.html con datos', async () => {
    const renderMock = jest.fn()
    const fakeId = 5

    await controller.edit({ params: { id: fakeId } }, { render: renderMock })
    expect(serviceMock.getById).toHaveBeenCalledTimes(1)
    expect(serviceMock.getById).toHaveBeenCalledWith(5)
    expect(renderMock).toHaveBeenCalledTimes(1)
    expect(renderMock).toHaveBeenCalledWith("cars/view/form.html", { car: {} })
})

test('edit entra en el catch', async () => {
    const sessionMock = {}
    const redirectMock = jest.fn()
    serviceMock.getById.mockImplementationOnce(() => Promise.reject(new Error('fail')))

    await controller.edit({ params: { id: 5 }, session: sessionMock }, { redirect: redirectMock })
    expect(serviceMock.getById).toHaveBeenCalledTimes(1)
    expect(serviceMock.getById).toHaveBeenCalledWith(5)
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith('/car')
    expect(sessionMock).toEqual({ errors: ["fail"] })
})

test('remove da error si no le pasa id', async () => {
    await expect(controller.remove({ params: {} }, {})).rejects.toThrowError(CarIdNotDefinedError)
})

test('remove redirecciona a /car con mensaje de exito', async () => {
    const sessionMock = {}
    const redirectMock = jest.fn()

    await controller.remove({ params: { id: 5 }, session: sessionMock }, { redirect: redirectMock })

    expect(serviceMock.remove).toHaveBeenCalledTimes(1)
    expect(serviceMock.remove).toHaveBeenCalledWith(5)
    expect(sessionMock).toEqual({ messages: [`El auto con id 5 se ha eliminado`] })
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/car")
})

test('remove recibe error de service.remove y devuelve error', async () => {
    const sessionMock = {}
    const redirectMock = jest.fn()
    serviceMock.remove.mockImplementationOnce(() => Promise.reject(new Error('fail')))

    await controller.remove({ params: { id: 5 }, session: sessionMock }, { redirect: redirectMock })

    expect(serviceMock.remove).toHaveBeenCalledTimes(1)
    expect(serviceMock.remove).toHaveBeenCalledWith(5)
    expect(sessionMock).toEqual({ errors: [`No se pudo eliminar el auto con id 5`] })
    expect(redirectMock).toHaveBeenCalledTimes(1)
    expect(redirectMock).toHaveBeenCalledWith("/car")
})

test('configureRoutes llama a app', () => {
    const app = {
        get: jest.fn(),
        post: jest.fn()
    }

    controller.configureRoutes(app)

    expect(app.get).toHaveBeenCalledTimes(5)
    expect(app.post).toHaveBeenCalledTimes(2)
})