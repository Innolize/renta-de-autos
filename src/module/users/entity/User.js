module.exports = class User {
    constructor(nombre, apellido, tipoDocumento, numeroDocumento, nacionalidad, direccion, telefono, email) {
        this.nombre = nombre,
            this.apellido = apellido,
            this.tipoDocumento = tipoDocumento,
            this.numeroDocumento = numeroDocumento,
            this.nacionalidad = nacionalidad,
            this.direccion = direccion,
            this.telefono = telefono,
            this.email = email,
            this.nacimiento = nacimiento
    }
}