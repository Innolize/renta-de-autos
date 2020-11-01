const InvalidDateError = require('./error/invalidDateError')
const InvalidDateFormat = require('./error/invalidDateFormat')

module.exports = function validarFechas(fechaInicial, fechaFinal) {
    const fecha1 = new Date(fechaInicial)
    const fecha2 = new Date(fechaFinal)

    const resultado = fecha1 - fecha2
    console.log(resultado)
    if (resultado <= 0) {
        return true
    } else if (resultado > 0) {
        throw new InvalidDateError("La fecha final de la renta debe ser mayor a la inicial")
        // 
    }else{
        //Entra al else si no le pasan fechas en fecha inicial o final
        //y el resultado de fecha1 - fecha 2 es NaN
        throw new InvalidDateFormat("Fecha inicial o fecha final invalida")
    }

}