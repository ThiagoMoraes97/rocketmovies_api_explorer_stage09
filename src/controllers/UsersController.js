const AppError = require("../utils/AppError");
const { hash } = require("bcryptjs");

class UsersController {
  async create(request, response) {
    const { name, email, password} = request.body;

    response.status(201).json();
  };
};


module.exports = UsersController;