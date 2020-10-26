require('dotenv').config()
const express = require('express')
const app = express()
const nunjucks = require('nunjucks')

const { init: initCarModule } = require('./module/cars/module')
const { init: initUserModule } = require('./module/users/module')
const { init: initRentModule } = require('./module/rent/module')
const configureDependencyInjection = require('./config/di')

const container = configureDependencyInjection()
app.use(container.get('Session'))

app.use(express.static('public'))

nunjucks.configure('src/module', {
    autoescape: true,
    express: app
})

initCarModule(app, container)
initUserModule(app, container)
initUserModule(app, container)
initRentModule(app, container)

app.listen(8000, () => console.log('escuchando en http://localhost:8000/'))