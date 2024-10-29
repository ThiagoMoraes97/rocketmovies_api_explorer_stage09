const AppError = require("../utils/AppError");
const { hash } = require("bcryptjs");

class UserCreateService {

    constructor(userRepositories){
        this.userRepositories = userRepositories
    };

    async execute({name, email, password}) {

        const checkIfEmailExist = this.userRepositories.findByEmail();

        if(checkIfEmailExist){
        throw new AppError("E-mail já cadastrado!")
        };

        const hashedPassword = await hash(password, 8);

       const userCreated =  this.userRepositories.create({name, email, password: hashedPassword});

       return userCreated;
    };

};

module.exports = UserCreateService;