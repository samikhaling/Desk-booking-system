const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companyUserSchema = new Schema({
  ownerFname: {
    type: String,
    required: true,
  },
  ownerLname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  companies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Company",
    },
  ],
});

module.exports = mongoose.model("CompanyUser", companyUserSchema);
