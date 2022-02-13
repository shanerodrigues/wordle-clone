const axios = require("axios")
const express = require("express")
const cors = require("cors")
const app = express()
require("dotenv").config()

app.use(cors())

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on PORT ${PORT}`)
})

app.get("/word", (req, res) => {
  const options = {
    method: "GET",
    url: "https://random-words5.p.rapidapi.com/getMultipleRandom",
    params: { count: "3", wordLength: "5" },
    headers: {
      "x-rapidapi-host": "random-words5.p.rapidapi.com",
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
    },
  }

  axios
    .request(options)
    .then((response) => {
      let num = Math.floor(Math.random() * 3)
      res.json(response.data[num])
    })
    .catch((error) => {
      console.error(error)
    })
})

app.get("/check", (req, res, next) => {
  const { word } = req.query
  axios
    .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => res.send(response.data[0]))
    .catch((err) => res.send(err.response.data))
})
