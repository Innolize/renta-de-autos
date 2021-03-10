module.exports = function calcularPrecioTotal(fechaInicio, fechaFinal, precio) {
    let fechaInicioConvertida = new Date(fechaInicio)
    let fechaFinalConvertida = new Date(fechaFinal)

    let diferenciaEnMilisegundos = fechaFinalConvertida - fechaInicioConvertida

    const MILISEGUNDOS_A_DIAS = (1000 * 60 * 60 * 24)
    const diferenciaDeDias = diferenciaEnMilisegundos / MILISEGUNDOS_A_DIAS

    return diferenciaDeDias * precio
}