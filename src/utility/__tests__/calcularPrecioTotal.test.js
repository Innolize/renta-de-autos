const calcularPrecioTotal = require('../calcularPrecioTotal')

const fecha1 = "2020-11-1"
const fecha2 = "2020-11-5"
const precio = 100

test('CalcularPrecioTotal devuelve resultado correcto', () => {
    const resultado = calcularPrecioTotal(fecha1, fecha2, precio)
    expect(resultado).toEqual(400)
})
