require('dotenv').config()
const express = require('express')
const configureDependencyInjection = require('./di')

const app = express()
const container = configureDependencyInjection(app)
app.use(container.get('Session'))


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
        pasajeros: 4,
        cajaCambios: "manual",
        imagen: '/uploads/carsDefault/chevrolet-corsa.jpg'
    })
    await corsa.save()

    const cruze = Car.build({
        marca: "Chevrolet",
        modelo: "Cruze",
        año: 2019,
        kilometraje: 35000,
        color: 'gris',
        aireAcondicionado: true,
        pasajeros: 4,
        cajaCambios: "manual",
        imagen: '/uploads/carsDefault/chevrolet-cruze.jpg'
    })
    await cruze.save()

    const argo = Car.build({
        marca: "Fiat",
        modelo: "Argo",
        año: 2012,
        kilometraje: 120000,
        color: 'azul',
        aireAcondicionado: true,
        pasajeros: 4,
        cajaCambios: "automatico",
        imagen: '/uploads/carsDefault/fiat-argo.jpeg'
    })
    await argo.save()

    const renault12 = Car.build({
        marca: "Renault",
        modelo: "12",
        año: 1989,
        kilometraje: 340000,
        color: 'Rojo',
        aireAcondicionado: false,
        pasajeros: 4,
        cajaCambios: "manual",
        imagen: '/uploads/carsDefault/renault-12.jpg'
    })
    await renault12.save()

    const tesla = Car.build({
        marca: "tesla",
        modelo: "S",
        año: 2017,
        kilometraje: 40000,
        color: 'Rojo',
        aireAcondicionado: true,
        pasajeros: 4,
        cajaCambios: "automatico",
        imagen: '/uploads/carsDefault/tesla-s.jpg'
    })
    await tesla.save()

    const Passat = Car.build({
        marca: "Volkswagen",
        modelo: "Passat",
        año: 2015,
        kilometraje: 110000,
        color: 'Gris',
        aireAcondicionado: true,
        pasajeros: 4,
        cajaCambios: "manual",
        imagen: '/uploads/carsDefault/volkswagen-passat.jpg'
    })
    await Passat.save()

})()

const sessionDb = container.get('SessionSequelize')
sessionDb.sync()