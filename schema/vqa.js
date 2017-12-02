const mongoose = require("mongoose");
const vqaSchema = mongoose.Schema({
  image_id: String,
  question: String,
  question_id: String	
});
vqaSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id  }
});
module.exports = mongoose.model("Vqa", vqaSchema);
