const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class NotesController {
  async create(request, response){
    const { title, description, rating, tags} = request.body;
    const { user_id } = request.params;

    const checkRating = rating <= 5 && rating >= 1

    if(!checkRating) {
      throw new AppError("A classificação deve ser entre 1 e 5");
    }

    const [note_id] = await knex("notes").insert({
      title,
      description,
      rating,
      user_id
    });

    const noteTags = tags.map(tag => {
      return {
        note_id,
        user_id,
        name: tag
      }
    });

    await knex("tags").insert(noteTags);
   
    response.status(201).json();
  };

  async index( request, response){
    const { user_id } = request.params;

    const userNotes = await knex("notes").where({user_id}).orderBy("rating");
    const userTags = await knex("tags").where({user_id});

    const notesWithTags = userNotes.map( note => {
      const tags = userTags.filter( tag => tag.note_id === note.id)
      return {
        ...note,
        tags
      }
    })

    response.json(notesWithTags);
  };

  async show( request, response){
    const { id } = request.body;

  };

  async delete( request, response ){
    const { id } = request.params;

    await knex("notes").where({id}).delete();

    response.status(204).json();
  };
};


module.exports = NotesController;