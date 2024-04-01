const express = require("express");
const app = express();
const PORT = 3000;
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const chalk = require("chalk");
const moment = require("moment");
const _ = require("lodash");

/* Levantar servidor  */
app.listen(PORT, () => {
  console.log("Conectado al puerto " + PORT);
});

/* Axios */
app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://randomuser.me/api/?results=12");
    /* Que nos traemos del usuario  */
    const users = response.data.results.map((user) => ({
      /* UUID */
      id: uuidv4(), 
      name: user.name.first + " " + user.name.last,
      gender: user.gender,
      date: moment(user.registered.date).format("MM-DD-YYYY HH:mm:ss"),
    }));
    /* para agruparlos por Genero y Chalk*/
    const usersGender = _.groupBy(users, "gender");
    _.forEach(usersGender, (group, gender) => {
      console.log(chalk.bgRed.white(`${gender}:`));
      group.forEach((user) => {
        console.log(chalk.bgWhite.blueBright(`Nombre: ${user.name}, ID: ${user.id} , Fecha: ${user.date}`
          )
        );
      });
    });
    res.json(users);
  } catch (error) {
    console.error("Error en la Api:", error);
    res.status(500).send("Error al obtener los datos de la API");
  }
});
