const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companySchema = new Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    companyOwner: {
      fname: {
        type: String,
        required: true,
      },
      lname: {
        type: String,
        required: true,
      },
    },
    contactNumber: {
      type: Number,
      required: true,
    },
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    workEmail: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "CompanyUser",
      required: true,
    },
    floors: [
      {
        type: Schema.Types.ObjectId,
        ref: "Floor",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
