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
    const { user_id, title, tags } = request.query;

    let notes 

    if (tags){

      const filterTags = tags.split(",").map(tag => tag.trim());

      notes = await knex("tags")
      .select("notes.id", "notes.rating", "notes.description", "notes.user_id")
      .whereIn("tags.name", filterTags)
      .whereLike("notes.title", `%${title}%`)
      .where("tags.user_id", user_id)
      .orderBy("notes.title")
      .innerJoin("notes", "notes.id", "tags.note_id");

    } else {

      notes = await knex("notes")
      .whereLike("title", `%${title}%`)
      .where({user_id})
      .orderBy("title");
    }

    const userTags = await knex("tags").where({user_id});

    const notesWithTags = notes.map( note => {
      const noteTags = userTags.filter( tag => tag.note_id  === note.id)
      return{
        ...note,
        tags: noteTags
      }
     
    });

    response.json(notesWithTags);
  };

  async show( request, response){
    const { id } = request.params;

    const note = await knex("notes").where({id}).first();
    const tags = await knex("tags").where({note_id: id});

    const notesWithTags = {
      ...note,
      tags
    }

    response.json(notesWithTags);

  };

  async delete( request, response ){
    const { id } = request.params;

    await knex("notes").where({id}).delete();

    response.status(204).json();
  };
};


module.exports = NotesController;