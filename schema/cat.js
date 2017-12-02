const mongoose = require("mongoose");
const catSchema = mongoose.Schema({
  image: String,
  question: String,
	answers: Array,
	updated: { type: Boolean, default: false },
	incorrect: Array
});
catSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id  }
});
module.exports = mongoose.model("Cat", catSchema);
