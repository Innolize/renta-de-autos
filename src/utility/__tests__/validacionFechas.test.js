const validarFechas = require('../validacionFechas')
const InvalidDateError = require('../error/invalidDateError')
const InvalidDateFormat = require('../error/invalidDateFormat')

let hoy = new Date()
let fechaMenor = hoy.getTime()
let fechaMayor = new Date(hoy.setDate(hoy.getDate() + 1))

test('Devuelve true si la fecha final es mayor a la fecha inicial', () => {
    const resultado = validarFechas(fechaMenor, fechaMayor)
    console.log(resultado)
    expect(resultado).toEqual(true)
})

test('validarFechas devuelve error InvalidDateError al pasar una fechaFinal menor a la inicial', () => {
    expect(
        () => {
            validarFechas(fechaMayor, fechaMenor)
        }).toThrowError(InvalidDateError)

    expect(
        () => {
            validarFechas(fechaMayor, fechaMenor)
        }).toThrowError("La fecha final de la renta debe ser mayor a la inicial")
})

test('validarFechas devuelve InvalidDateFormat cuando se le pasa algun parametro que no sea una fecha ', () => {
    expect(
        () => {
            validarFechas(fechaMenor, undefined)
        }).toThrowError(InvalidDateFormat)

    expect(
        () => {
            validarFechas(fechaMenor, undefined)
        }).toThrow("Fecha inicial o fecha final invalida")
})
