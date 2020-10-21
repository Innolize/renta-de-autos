require('dotenv').config()
const express = require('express')
const configureDependencyInjection = require('./di')

const app = express()
const container = configureDependencyInjection(app)

const mainDb = container.get('Sequelize')

container.get('CarModel')

mainDb.sync({ force: true })