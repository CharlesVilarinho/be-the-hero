const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        const { id } = request.body;

        if (!id) {
            return response.json({"success":false,"message":"Parâmetros obrigátorios inválidos"});
        }

        const ongName = await connection('ongs').where({id}).select('name').first();
    
        if (!ongName) {
            return response.json({"success":false,"message":"Ong não encontrada"});
        }
        return response.json(ongName);
    }
};