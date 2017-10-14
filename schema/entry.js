const mongoose = require("mongoose");
const entrySchema = mongoose.Schema({
  image: String,
  question: String,
	responses: Object,
	private: String,
	updated: { type: Boolean, default: false },
	incorrect: Object
});
entrySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id  }
});


module.exports = mongoose.model("Entry", entrySchema);
