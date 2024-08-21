const AppError = require("../utils/AppError");
const { hash, compare } = require("bcryptjs");
const knex = require("../database/knex");

class UsersController {
  async create(request, response) {
    const { name, email, password} = request.body;

    const checkIfEmailExist = await knex("users").where({email}).first();

    if(checkIfEmailExist){
      throw new AppError("E-mail já cadastrado!")
    };

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword
    });

    response.status(201).json();
  };

  async update(request, response) {
    const {name, email, password, old_password} = request.body;
    const { id } = request.params;

    const user = await knex("users").where({id});

   

  };

  async delete(request, response) {

    const { id } = request.params;

    await knex("users").where({id}).delete();

    response.status(204).json();

  };

};


module.exports = UsersController;