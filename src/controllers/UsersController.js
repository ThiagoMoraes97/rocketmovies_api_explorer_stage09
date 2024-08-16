const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");

class UsersController {
  create(request, response) {
    const { name, email} = request.body;

    const database = sqliteConnection();
    const checkIfUserExist = database.get("SELECT FROM users WHERE email = (?)", [email]);

    if(checkIfUserExist){
      throw new AppError("E-mail de usuário já existe!")
    };

    response.status(201).json();
  };
};


module.exports = UsersController;