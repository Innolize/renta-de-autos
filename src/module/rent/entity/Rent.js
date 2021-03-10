module.exports = class Rent {
    constructor({id, rentaInicio, rentaTermina, precioDia, precioTotal, formaPago, abonado, AutoRentado, UsuarioRentado}) {
        this.id = id
        this.rentaInicio = rentaInicio
        this.rentaTermina = rentaTermina
        this.precioDia = precioDia
        this.precioTotal = precioTotal
        this.formaPago = formaPago
        this.abonado = abonado
        this.AutoRentado = AutoRentado
        this.UsuarioRentado = UsuarioRentado
    }
}