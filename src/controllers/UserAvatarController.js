const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarController {
  async update( request, response) {
    const user_id = request.user.id;
    const fileName = request.file.filename;

    const diskStorage = new DiskStorage();

    const user = await knex("users").where({id: user_id}).first();

    if(!user){
      throw new AppError("Só é possível atualizar imagem de usuários cadastrados.")
    };

    if(user.avatar){
      await diskStorage.deleteFile(user.avatar)
    };

    await diskStorage.saveFile(fileName);

    user.avatar = fileName;

    await knex("users").update(user).where({id: user_id});

    return response.json(user);

  };
};

module.exports = UserAvatarController;