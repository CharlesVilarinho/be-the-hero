const connection = require('../database/connection');
const columns = ["title", "description", "value"];

module.exports = {
    async index(request, response) {
        const ong_id = request.headers.authorization;
        if (!ong_id) {
            return response.json({"success":false,"message":"Parâmetros obrigátorios inválidos"});
        }

        let filtros = {ong_id};
        for(var key in request.query) {
            if (columns.includes(key)) {
                filtros[key] = request.query[key];
            }
        }

        const lista = await connection('incidents').where(filtros).select('*');
    
        return response.json(lista);
    }
};