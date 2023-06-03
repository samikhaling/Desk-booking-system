const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const floorSchema = new Schema(
  {
    floorNumber: {
      type: Number,
      required: true,
    },
    roomCapacity: {
      type: Number,
      required: true,
    },
    deskCapacity: {
      type: Number,
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    rooms: [
      {
        amenities: [String],
        roomNo: {
          type: Number,
          required: true,
        },
        bookStatus: {
          type: Boolean,
          default: false,
          required: true,
        },
        bookedBy: {
          type: String,
          default: " ",
          required: true,
        },
        startDate: {
          type: String,
          default: " ",
          required: true,
        },
        endDate: {
          type: String,
          default: " ",
          required: true,
        },
        desks: [
          {
            deskNo: {
              type: Number,
              required: true,
            },
            bookStatus: {
              type: Boolean,
              default: false,
              required: true,
            },
            bookedBy: {
              type: String,
              default: " ",
              required: true,
            },
            startDate: {
              type: String,
              default: " ",
              required: true,
            },
            endDate: {
              type: String,
              default: " ",
              required: true,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);
module.exports = mongoose.model("Floor", floorSchema);
