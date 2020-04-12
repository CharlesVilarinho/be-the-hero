const crypto = require('crypto');
const connection = require('../database/connection');
const columns = ["name", "email", "wpp", "city", "uf"];

module.exports = {
    async index(request, response) {
        const filtros = {};
        for(var key in request.query) {
            if (columns.includes(key)) {
                filtros[key] = request.query[key];
            }
        }
        const lista = await connection('ongs').where(filtros).select('*');
        // ).select('*').returning('*').toString();
    
        return response.json(lista);
    },

    async create(request, response) {
        const {name, email, wpp, city, uf} = request.body;
        const id = crypto.randomBytes(4).toString('HEX');

        if (!id || !name || !email || !wpp || !city || !uf) {
            return response.json({"success":false,"message":"Parâmetros obrigátorios inválidos"});
        }
        const insert = await connection('ongs').insert({
            id,
            name,
            email,
            wpp,
            city,
            uf
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
    
        const update = await connection('ongs').where({id}).update(att);
        return response.json({"success":true,"message":"Registro atualizado com sucesso","id":id});
    },

    async delete(request, response) {
        const {id} = request.params;
    
        if (!id) {
            return response.json({"success":false,"message":"Parâmetros obrigátorios inválidos"});
        }
    
        const del = await connection('ongs').where({id}).delete();
        return response.json({"success":true,"message":"Registro excluído com sucesso","id":id});
    }
}