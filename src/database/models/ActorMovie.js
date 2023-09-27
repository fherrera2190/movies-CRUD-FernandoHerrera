module.exports = (sequelize, dataTypes) => {
  let alias = "ActorMovie";
  let cols = {
    id: {
      type: dataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    movie_id: {
      type: dataTypes.INTEGER
    },
    actor_id: {
      type: dataTypes.INTEGER
    }
  };
  let config = {
    tableName: "actor_movie",
    timestamps: false
  };
  const Genre = sequelize.define(alias, cols, config);

  return Genre;
};
