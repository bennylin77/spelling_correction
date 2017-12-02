const mongoose = require("mongoose");
const answerSchema = mongoose.Schema({
  image: String,
	answers: Object,
});
answerSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id  }
});
module.exports = mongoose.model("Answer", answerSchema);
