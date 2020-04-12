const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        const { id } = request.body;

        if (!id) {
            return response.json({"success":false,"message":"Par�metros obrig�torios inv�lidos"});
        }

        const ongName = await connection('ongs').where({id}).select('name').first();
    
        if (!ongName) {
            return response.json({"success":false,"message":"Ong n�o encontrada"});
        }
        return response.json(ongName);
    }
};