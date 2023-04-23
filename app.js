const express = require("express");
const app = express();
const PORT = 4000;
const sequelize = require("../db/database");
const bodyParser = require("body-parser");
const axios = require("axios");
require('dotenv').config()

// const cors = require("cors");

//middleware
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

const token = process.env.TOKEN;


//subscription webhooks
app.get("/webhooks", (req, res) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  const myToken = process.env.MYTOKEN;

  if (mode && token) {
    if (mode === "subcribe" && token === myToken) {
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  }
});



//
app.post("/webhooks", (req, res) => {
  let body_param = req.body;
  console.log(JSON.stringify(body_param, null, 2));

  if (body_param.object) {
    if (
      body_param.entry &&
      body_param.entry[0].changes &&
      body_param.entry[0].changes[0].value.message &&
      body_param.entry[0].changes[0].value.message[0]
    ) {
      let phoneNumberID =
        body_param.entry[0].changes[0].value.metadata.phone_number_id;
      let from = body_param.entry[0].changes[0].value.messages[0].from;
      let msgBody = body_param.entry[0].changes[0].value.messages[0].text.body;
      
      axios({
        method: "POST",
        url:
          "https://graph.facebook.com/v16.0/" + phoneNumberID + "/messages?access_token=" + token,
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: {
            body: "Hi.. Pigu",
          },
        },

        headers: {
          "Content-Type": "application/json",
        },
      });

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

app.listen(PORT, () => console.log("servidor iniciado en ", PORT));

//server
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Conexion exitosa");
  })
  .catch((error) => {
    console.log("Se ha producido un error", error);
  });

