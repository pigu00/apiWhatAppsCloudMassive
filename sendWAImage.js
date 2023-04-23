import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import fetch from "node-fetch";
import { telefonosDestino } from "./telefonosDestino.js";




  const telefonos = telefonosDestino;
  for (let i = 0; i < telefonos.length; i++) {
    const botId = process.env.BOTID;
    const phoneNbr = telefonos[i];
    const bearerToken = process.env.TOKEN;
  
    const url = "https://graph.facebook.com/v16.0/" + botId + "/messages";
    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: phoneNbr,
      type: "template",
      template: {
        name: "demo_test_envios_lalo_c",
        language: {
          code: "es_AR",
        },
        components: [
          {
            type: "header",
            parameters: [
              {
                type: "image",
                image: {
                  link: "https://www.el1digital.com.ar/wp-content/uploads/2022/06/lalo-lalo.jpg",
                },
              },
            ],
          },
        ],
      },
    };
  
    const postReq = {
      method: "POST",
      headers: {
        Authorization: "Bearer " + bearerToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      json: true,
    };
  
    async function enviarMensaje() {
      try {
        const response = await fetch(url, postReq);
  
        if (!response.ok) {
          throw new Error(`Error! status: ${response.status}`);
        }
  
        const result = await response.json();
        return result;
      } catch (err) {
        console.log(err);
      }
    }
  
    // console.log(await enviarMensaje());
  }



