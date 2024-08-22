const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class TagsController {
  async index (request, response) {
    const { user_id } = request.params

    const userTags = await knex("tags").where({user_id});

    response.json(userTags);
  };
};


module.exports = TagsController;