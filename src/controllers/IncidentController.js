const connection = require('../database/connection');
const columns = ["title", "description", "value", "ong_id"];

module.exports = {
    async index(request, response) {
        const limit = 5;
        const start = ((request.query.page || 1) - 1) * limit;

        let filtros = {};
        for(var key in request.query) {
            if (columns.includes(key)) {
                filtros[key] = request.query[key];
            }
        }

        const [count] = await connection('incidents').where(filtros).count();
        const lista = await connection('incidents').join('ongs', 'ongs.id', '=', 'incidents.ong_id').
        where(filtros).limit(limit).offset(start).select(['incidents.*', 'ongs.name', 'ongs.email', 'ongs.wpp', 'ongs.city', 'ongs.uf']);
    
        response.header('X-Total-Count', count["count(*)"]);
        return response.json({"incidents":lista,"count":count});
    },

    async create(request, response) {
        const {title, description, value} = request.body;
        const ong_id = request.headers.authorization;

        if (!title || !description || !value || !ong_id) {
            return response.json({"success":false,"message":"Parâmetros obrigátorios inválidos"});
        }
        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

        return response.json({"success":true,"message":"Cadastro realizado com sucesso","id":id});
    },

    async update(request, response) {
        const {id} = request.body;
    
        if (!id) {
            return response.json({"success":false,"message":"Parâmetros obrigátorios inválidos"});
        }
    
        let att = {};
        for(var key in request.body) {
            if (columns.includes(key)) {
                att[key] = request.body[key];
            }
        }
    
        const update = await connection('incidents').where({id}).update(att);
        return response.json({"success":true,"message":"Registro atualizado com sucesso","id":id});
    },

    async delete(request, response) {
        const {id} = request.params;
        const ong_id = request.headers.authorization;
    
        if (!id) {
            return response.json({"success":false,"message":"Parâmetros obrigátorios inválidos"});
        }

        const incident = await connection('incidents').where({id}).select('ong_id').first();

        if (incident.ong_id != ong_id) {
            return response.status(401).json({"success":true,"message":"Permissão negada","id":id});
        }
    
        const del = await connection('incidents').where({id}).delete();
        return response.json({"success":true,"message":"Registro excluído com sucesso","id":id});
    }
}