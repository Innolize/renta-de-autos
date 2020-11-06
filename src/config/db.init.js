require('dotenv').config()
const express = require('express')
const configureDependencyInjection = require('./di')

const app = express()
const container = configureDependencyInjection(app)
app.use(container.get('Session'))


const mainDb = container.get('Sequelize')
const User = container.get('UserModel')
const Car = container.get('CarModel');
const Rent = container.get('RentModel');

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
        precio: 130,
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
        precio: 220,
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
        precio: 180,
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
        precio: 80,
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
        precio: 400,
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
        precio: 120,
        imagen: '/uploads/carsDefault/volkswagen-passat.jpg'

    })
    await Passat.save()


    const Usuarios = await User.bulkCreate([
        { nombre: "Carlitos", apellido: "Test", tipoDocumento: "DNI", numeroDocumento: "35945234", nacionalidad: "Argentina", direccion: "direccionTest 352", telefono: 45674321, email: "test123@yahoo.com", nacimiento: "1990-05-05"}
    ])

})()

const sessionDb = container.get('SessionSequelize')
sessionDb.sync()