const express = require('express');
const ongController = require('./controllers/OngController')
const incidentController = require('./controllers/IncidentController')
const profileController = require('./controllers/ProfileController')
const sessionController = require('./controllers/SessionController')

const routes = express.Router();

routes.get('/ongs', ongController.index);
routes.post('/ongs', ongController.create);
routes.put('/ongs', ongController.update);
routes.delete('/ongs/:id', ongController.delete);

routes.get('/incident', incidentController.index);
routes.post('/incident', incidentController.create);
routes.put('/incident', incidentController.update);
routes.delete('/incident/:id', incidentController.delete);

routes.get('/profile', profileController.index);

routes.post('/sessions', sessionController.create);

module.exports = routes;