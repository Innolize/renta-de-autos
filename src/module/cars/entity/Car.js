module.exports = class Car {
    constructor({ id, marca, modelo, año, kilometraje, color, aireAcondicionado, capacidad, cambios }) {
        this.id = id,
            this.marca = marca,
            this.modelo = modelo,
            this.año = año,
            this.kilometraje = kilometraje,
            this.color = color,
            this.aireAcondicionado = aireAcondicionado,
            this.capacidad = capacidad,
            this.cambios = cambios
    }
}