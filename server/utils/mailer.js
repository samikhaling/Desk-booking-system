const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

const mailer = nodemailer.createTransport(
  sgTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

const sendEmail = ({
  title = "Your booking is verified",
  description = "",
  user,
}) => {
  mailer.sendMail(
    {
      to: user?.email,
      from: "bookyourdesk2022@gmail.com",
      fromname: "Desk Booking System",
      subject: title,
      html: `<div style="text-align: center;">
      <img style="width: 200px; " src="cid:greeting_image"/>
        <h2>Greeting, ${user?.fname || ""} ${user?.lname || ""}</h2>
        <h4>${description}</h4>


        <p>Want To Know More About Our Company, Visit http://localhost:3000/landing</p>
      </div>`,
      attachments: [
        {
          filename: "mailer_image.png",
          path: __dirname + "/mailer_image.png",
          cid: "greeting_image", //same cid value as in the html img src
        },
      ],
    },
    function (err, res) {
      if (err) {
        throw err;
      }
    }
  );
};

module.exports = {
  sendEmail,
};
