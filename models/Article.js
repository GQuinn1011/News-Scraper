  var mongoose = require("mongoose");

  var Schema = mongoose.Schema;

  var ArticleSchema = new Schema({

      title: {
          type: String,
          required: true
      },

      url: {
          type: String,
          required: true
      },
      byline: {
          type: String,
          required: true
      },
      img: {
          type: String,
          required: true
      },

      notes: [{

          type: Schema.Types.ObjectId,

          ref: "Note"
      }]
  });

  var Article = mongoose.model("Article", ArticleSchema);

  module.exports = Article;