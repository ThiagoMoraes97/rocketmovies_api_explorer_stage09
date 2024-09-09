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

    return response.status(201).json();
  };

  async update(request, response) {
    const {name, email, password, old_password} = request.body;
    const user_id = request.user.id;
  
    const user = await knex("users").where({id: user_id}).first();

    if (email){
      const checkEmailExist = await knex("users").where({email}).first();
      
      if(checkEmailExist && checkEmailExist.id !== user.id) {
        throw new AppError("E-mail indisponível!")
      };
    }

    if (password && !old_password) {
      throw new AppError("É necessário passar a senha atual!")
    };

    if( password && old_password){

      const checkPassword = await compare(old_password, user.password)
     
      if(!checkPassword) {
        throw new AppError("Senha antiga incorreta!")
      }

      const newHashedPassword = await hash(password, 8)
      user.password = newHashedPassword ?? user.password
    };
    
    user.name = name ?? user.name
    user.email = email ?? user.email
   

    await knex("users").where({id: user_id}).update({
      name: user.name,
      email: user.email,
      password: user.password
    });
    

    return response.json();

  };

  async delete(request, response) {

    const user_id = request.user.id;

    await knex("users").where({id: user_id}).delete();

    response.status(204).json();

  };

};


module.exports = UsersController;