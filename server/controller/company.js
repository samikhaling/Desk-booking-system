const { default: mongoose } = require("mongoose");
const Company = require("../model/company");
const User = require("../model/user");
const CompanyUser = require("../model/companyUser");
const Floor = require("../model/floor");
const { sendEmail } = require("../utils/mailer");

exports.getNewWorkspace = async (req, res, next) => {
  try {
    const companies = await Company.find().populate("floors");
    if (!companies) {
      const error = new Error("No companies is created");
      throw error;
    }
    res.status(200).json({
      message: "companies fetched successfully",
      result: companies,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getCompany = async (req, res, next) => {
  const companyId = req.params.cid;
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      const error = new Error("company does not exists");
      error.statusCode = 404;
      throw error;
    }
    res
      .status(200)
      .json({ message: "company fetched successfully", result: company });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getCompanies = async (req, res, next) => {
  const userMode = req.params.mode;
  // console.log(userMode, req.userId, "backend");
  let companies;
  try {
    if (userMode === "user") {
      companies = await Company.find().populate("floors");
    } else {
      companies = await Company.find({ owner: req.userId }).populate("floors");
    }
    if (!companies) {
      const error = new Error("No companies is created");
      throw error;
    }
    res.status(200).json({
      message: "companies fetched successfully",
      result: companies,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getCompanyFloors = async (req, res, next) => {
  const companyId = req.params.cId;
  console.log(companyId);
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      const error = new Error("Company not found");
      error.statusCode = 404;
      throw error;
    }
    const { floors } = await company.populate("floors");
    res.status(200).json({
      message: "floors fetched successfully",
      results: floors,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.getFloorRooms = async (req, res, next) => {
  const floorId = req.params.fId;
  console.log(floorId, "floorId");
  try {
    const floor = await Floor.findById(floorId);
    if (!floor) {
      const error = new Error("floor not found");
      error.statusCode = 404;
      throw error;
    }
    const { rooms } = await floor.populate("rooms");
    res.status(200).json({
      message: "rooms fetched successfully",
      results: rooms,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postCompanyInfo = async (req, res, next) => {
  const companyName = req.body.companyName;
  const contactNumber = req.body.contactNumber;
  const street = req.body.street;
  const city = req.body.city;
  const state = req.body.state;
  const country = req.body.country;
  let dupCompany;
  try {
    const companyuser = await CompanyUser.findById(req.userId);
    console.log(companyuser);
    dupCompany = await Company.findOne({
      workEmail: companyuser?.email,
      companyName: companyName,
    });
    if (dupCompany) {
      const error = new Error("Company Already Exists!");
      error.statusCode = 409;
      throw error;
    }
    const company = new Company({
      companyName: companyName,
      companyOwner: {
        fname: companyuser?.ownerFname,
        lname: companyuser?.ownerLname,
      },
      contactNumber: contactNumber,
      address: {
        street: street,
        city: city,
        state: state,
        country: country,
      },
      workEmail: companyuser?.email,
      owner: req.userId,
      // floorPlan: { floors: [] },
    });
    const result = await company.save();
    companyuser.companies.push(company);
    await companyuser.save();
    res.status(200).json({
      message: "company Info register successfully",
      registerId: result._id,
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.deleteCompany = async (req, res, next) => {
  const companyId = req.params.cid;
  try {
    const company = await Company.findById(companyId);
    if (!company) {
      const error = new Error("Company not found");
      error.statusCode = 404;
      throw error;
    }
    if (company?.owner.toString() !== req.userId.toString()) {
      const error = new Error("Not Authorized");
      error.statusCode = 401;
      throw error;
    }
    await Company.findByIdAndRemove(companyId);
    await Floor.deleteMany({ company: companyId });
    const companyUser = await CompanyUser.findById(req.userId);
    companyUser.companies.pull(companyId);
    await companyUser.save();
    res.status(200).json({ message: "company deleted successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
exports.updateCompany = async (req, res, next) => {
  const companyId = req.params.cid;
  const companyName = req.body.companyName;
  const contactNumber = req.body.contactNumber;
  const street = req.body.street;
  const city = req.body.city;
  const state = req.body.state;
  const country = req.body.country;
  console.log(companyName, contactNumber, street, city, state, country);
  try {
    const company = await Company.findById(companyId);
    console.log(company.owner, req.userId);
    if (!company) {
      const err = new Error("Company not found");
      err.statusCode = 404;
      throw err;
    }
    if (company?.owner.toString() !== req.userId) {
      const error = new Error("Not Authorized");
      error.statusCode = 401;
      throw error;
    }
    company.companyName = companyName;
    company.contactNumber = contactNumber;
    company.address.street = street;
    company.address.city = city;
    company.address.state = state;
    company.address.country = country;

    const result = await company.save();
    res.status(200).json({
      message: "Company updated successfully",
    });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postAddFloor = async (req, res, next) => {
  const companyId = req.params.cid;
  const floorNumber = req.body.floorNo;
  const roomCapacity = req.body.roomCapacity;
  const deskCapacity = req.body.deskCapacity;
  const roomAmenities = req.body.Amenities;
  let dupFloor;
  try {
    dupFloor = await Floor.findOne({
      floorNumber: floorNumber,
    });
    if (dupFloor) {
      const error = new Error("Floor Number Already Exists!");
      error.statusCode = 409;
      throw error;
    }
    const floor = new Floor({
      floorNumber: floorNumber,
      roomCapacity: roomCapacity,
      deskCapacity: deskCapacity,
      company: mongoose.Types.ObjectId(companyId),
    });
    for (let i = 0; i < roomCapacity; i++) {
      floor.rooms.push({
        roomNo: +i + 1,
        amenities: roomAmenities,
      });
    }
    for (let i = 0; i < deskCapacity; i++) {
      floor.rooms.map((d) =>
        d.desks.push({
          deskNo: +i + 1,
        })
      );
    }
    await floor.save();
    const company = await Company.findById(companyId);
    company.floors.push(floor);
    await company.save();

    res.status(200).json({ message: "Floor added successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postDeskBooking = async (req, res, next) => {
  const fId = req.body.fId;
  const roomId = req.body.roomId;
  const deskId = req.body.deskId;
  const userMode = req.body.userMode;

  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  console.log(userMode, startDate, endDate);
  try {
    await Floor.updateOne(
      { _id: fId },
      {
        $set: {
          "rooms.$[room].desks.$[desk].bookStatus": true,
          "rooms.$[room].desks.$[desk].bookedBy": req.userId.toString(),
          "rooms.$[room].desks.$[desk].startDate": startDate.toString(),
          "rooms.$[room].desks.$[desk].endDate": endDate.toString(),
        },
      },
      {
        arrayFilters: [{ "room._id": roomId }, { "desk._id": deskId }],
      }
    );
    const bookedDesk = await Floor.findOne({
      _id: fId,
    });
    const room = bookedDesk?.rooms.filter(
      (r) => r._id.toString() === roomId.toString()
    );
    if (
      +room[0].desks.filter(
        (d) => d.bookedBy.toString() === req.userId.toString()
      ).length === +room[0].desks.length
    ) {
      await Floor.updateOne(
        { _id: fId },
        {
          $set: {
            "rooms.$[room].bookStatus": true,
            "rooms.$[room].bookedBy": req.userId.toString(),
            "rooms.$[room].startDate": startDate.toString(),
            "rooms.$[room].endDate": endDate.toString(),
          },
        },
        {
          arrayFilters: [{ "room._id": roomId }],
        }
      );
    }
    let user;
    if (userMode === "user") {
      user = await User.findById(req.userId);
    } else {
      user = await CompanyUser.findById(req.userId);
    }

    sendEmail({
      title: "Desk Booking Verified",
      description: "You have successfully book your desk.",
      user,
    });

    res.status(200).json({ message: "desk booked successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postDeskBookingCancel = async (req, res, next) => {
  const fId = req.body.fId;
  const roomId = req.body.roomId;
  const deskId = req.body.deskId;
  const userMode = req.body.userMode;

  try {
    const bookedDesk = await Floor.findOne({
      _id: fId,
    });
    const room = bookedDesk?.rooms.filter(
      (r) => r._id.toString() === roomId.toString()
    );
    const desk = room[0].desks.filter(
      (d) => d._id.toString() === deskId.toString()
    );

    const authUser = await User.findById(desk[0]?.bookedBy);
    if (userMode === "user") {
      const authUser = await User.findById(desk[0]?.bookedBy);
      if (desk[0].bookedBy.toString() !== req.userId.toString()) {
        const error = new Error(
          `Not Authorized! Booked by ${authUser?.fname} ${authUser?.lname}`
        );
        error.statusCode = 401;
        throw error;
      }
    }
    await Floor.updateOne(
      { _id: fId },
      {
        $set: {
          "rooms.$[room].desks.$[desk].bookStatus": false,
          "rooms.$[room].desks.$[desk].bookedBy": "",
          "rooms.$[room].desks.$[desk].startDate": "",
          "rooms.$[room].desks.$[desk].endDate": "",
        },
      },
      {
        arrayFilters: [{ "room._id": roomId }, { "desk._id": deskId }],
      }
    );
    if (
      +room[0].desks.filter(
        (d) => d.bookedBy.toString() === req.userId.toString()
      ).length <= +room[0].desks.length
    ) {
      await Floor.updateOne(
        { _id: fId },
        {
          $set: {
            "rooms.$[room].bookStatus": false,
            "rooms.$[room].bookedBy": "",
            "rooms.$[room].startDate": "",
            "rooms.$[room].endDate": "",
          },
        },
        {
          arrayFilters: [{ "room._id": roomId }],
        }
      );
    }

    sendEmail({
      title: "Desk Cancelation Verified",
      description:
        "You have successfully canceled book your desk, Sorry for the trouble",
      user: authUser,
    });
    res.status(200).json({ message: "booking cancel successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postRoomBooking = async (req, res, next) => {
  const fId = req.body.fId;
  const roomId = req.body.roomId;
  const userMode = req.body.userMode;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  try {
    await Floor.updateOne(
      { _id: fId },
      {
        $set: {
          "rooms.$[room].bookStatus": true,
          "rooms.$[room].bookedBy": req.userId.toString(),
          "rooms.$[room].startDate": startDate.toString(),
          "rooms.$[room].endDate": startDate.toString(),
          "rooms.$[room].desks.$[].bookStatus": true,
          "rooms.$[room].desks.$[].bookedBy": req.userId.toString(),
          "rooms.$[room].desks.$[].startDate": startDate.toString(),
          "rooms.$[room].desks.$[].endDate": endDate.toString(),
        },
      },
      {
        arrayFilters: [{ "room._id": roomId }],
      }
    );
    let user;
    if (userMode === "user") {
      user = await User.findById(req.userId);
    } else {
      user = await CompanyUser.findById(req.userId);
    }

    sendEmail({
      title: "Room booking verified",
      description: "You have successfully book Room.",
      user,
    });

    res.status(200).json({ message: "Room booked successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

exports.postRoomBookingCancel = async (req, res, next) => {
  const fId = req.body.fId;
  const roomId = req.body.roomId;
  const userMode = req.body.userMode;
  try {
    const bookedDesk = await Floor.findOne({
      _id: fId,
    });
    const room = bookedDesk?.rooms.filter(
      (r) => r._id.toString() === roomId.toString()
    );
    console.log(room, "cancel room");
    const authUser = await User.findById(room[0]?.bookedBy);
    if (userMode === "user") {
      if (room[0].bookedBy.toString() !== req.userId.toString()) {
        const error = new Error(
          `Not Authorized! Booked by ${authUser?.fname} ${authUser?.lname}`
        );
        error.statusCode = 401;
        throw error;
      }
    }
    await Floor.updateOne(
      { _id: fId },
      {
        $set: {
          "rooms.$[room].bookStatus": false,
          "rooms.$[room].bookedBy": "",
          "rooms.$[room].startDate": "",
          "rooms.$[room].endDate": "",
          "rooms.$[room].desks.$[].bookStatus": false,
          "rooms.$[room].desks.$[].bookedBy": "",
          "rooms.$[room].desks.$[].startDate": "",
          "rooms.$[room].desks.$[].endDate": "",
        },
      },
      {
        arrayFilters: [{ "room._id": roomId }],
      }
    );
    sendEmail({
      title: "Room booking canceled verified",
      description: "You have successfully canceled the booked room.",
      user: authUser,
    });
    res.status(200).json({ message: "booking cancel successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};
