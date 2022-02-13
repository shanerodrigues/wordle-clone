const axios = require("axios")
const express = require("express")
const cors = require("cors")
const app = express()
const path = require("path")
require("dotenv").config()

app.use(cors())
app.use(express.static(path.join(__dirname, "public")))

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on PORT 3000`)
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
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
      // res.send(res.text(response.data[num]))
      res.send(response.data[num])
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
