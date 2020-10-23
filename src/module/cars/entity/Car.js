module.exports = class Car {
    constructor({ id, marca, modelo, año, kilometraje, color, aireAcondicionado, pasajeros, cajaCambios, imagen }) {
        this.id = id,
            this.marca = marca,
            this.modelo = modelo,
            this.año = año,
            this.kilometraje = kilometraje,
            this.color = color,
            this.aireAcondicionado = aireAcondicionado,
            this.pasajeros = pasajeros,
            this.cajaCambios = cajaCambios,
            this.imagen = imagen
    }
}