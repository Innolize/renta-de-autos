require('dotenv').config()
const express = require('express')
const configureDependencyInjection = require('./di')

const app = express()
const container = configureDependencyInjection(app)

const mainDb = container.get('Sequelize')

const Car = container.get('CarModel');

(async () => {

    await mainDb.sync({ force: true });

    const corsa = Car.build({
        marca: "Chevrolet",
        modelo: "Corsa",
        año: 2005,
        kilometraje: 180000,
        color: 'blanco',
        aireAcondicionado: false,
        capacidad: 4,
        cambios: "manual"
    })
    await corsa.save()

    const cruze = Car.build({
        marca: "Chevrolet",
        modelo: "Cruze",
        año: 2019,
        kilometraje: 35000,
        color: 'gris',
        aireAcondicionado: true,
        capacidad: 4,
        cambios: "manual"
    })
    await cruze.save()

    const argo = Car.build({
        marca: "Fiat",
        modelo: "Argo",
        año: 2012,
        kilometraje: 120000,
        color: 'azul',
        aireAcondicionado: true,
        capacidad: 4,
        cambios: "automatico"
    })
    await argo.save()

    const renault12 = Car.build({
        marca: "Renault",
        modelo: "12",
        año: 1989,
        kilometraje: 340000,
        color: 'Rojo',
        aireAcondicionado: false,
        capacidad: 4,
        cambios: "manual"
    })
    await renault12.save()

    const tesla = Car.build({
        marca: "tesla",
        modelo: "S",
        año: 2017,
        kilometraje: 40000,
        color: 'Rojo',
        aireAcondicionado: true,
        capacidad: 4,
        cambios: "automatico"
    })
    await tesla.save()

    const Passat = Car.build({
        marca: "Volkswagen",
        modelo: "Passat",
        año: 2015,
        kilometraje: 110000,
        color: 'Gris',
        aireAcondicionado: true,
        capacidad: 4,
        cambios: "manual"
    })
    await Passat.save()

})()