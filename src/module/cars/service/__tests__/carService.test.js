const CarService = require('../carService')
const CarIdNotDefinedError = require('../error/carIdNotDefined')
const CarNotDefinedError = require('../error/carNotDefined')

afterEach(() => {
    jest.clearAllMocks();
});

const mockRepository = {
    getAll: jest.fn(),
    save: jest.fn(),
    getById: jest.fn(),
    remove: jest.fn(),
}

const Service = new CarService(mockRepository)

test('getAll llama a repository getAll una vez', async () => {
    await Service.getAll()
    expect(mockRepository.getAll).toHaveBeenCalledTimes(1)
})

test('CarService.save llama a Repository save una vez con data', async () => {
    await Service.save({ test: "test" })
    expect(mockRepository.save).toHaveBeenCalledTimes(1)
    expect(mockRepository.save).toHaveBeenCalledWith(({ test: "test" }))
})

test('CarService.save da error al no pasar parametro', async () => {
    await expect(Service.save).rejects.toThrowError(CarNotDefinedError)
})

test('CarService.getById llama a repositorio.getById una vez', async () => {
    await Service.getById(5)
    expect(mockRepository.getById).toHaveBeenCalledTimes(1)
    expect(mockRepository.getById).toHaveBeenCalledWith(5)
})

test('CarService.remove llama a repositorio.getById una vez', async () => {
    await Service.remove(5)
    expect(mockRepository.remove).toHaveBeenCalledTimes(1)
    expect(mockRepository.remove).toHaveBeenCalledWith(5)
})

test('CarService.remove da error al no pasar parametro', async () => {
    await expect(Service.remove).rejects.toThrowError(CarIdNotDefinedError)
})