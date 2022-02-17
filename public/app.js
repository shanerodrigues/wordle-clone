const tilesContainer = document.querySelector(".tile-container")
const keyContainer = document.querySelector(".key-container")
const messageDisplay = document.querySelector(".message-container")
const gameContainer = document.querySelector(".game-container")
const wordToGuess = document.querySelector("#word-to-guess")

//Modal consts
const yesBtn = document.getElementById("yesBtn")
const btnDiv = document.getElementById("btnDiv")
const modal = document.getElementById("myModal")
const span = document.getElementsByClassName("close")[0]
const noBtn = document.getElementById("noBtn")

let wordle

const getWordle = () => {
  // fetch("http://localhost:3000/word")
  fetch("/word")
    .then((response) => response.json())
    .then((json) => {
      wordle = json.word.toUpperCase()
    })
    .catch((err) => console.log(err))
}
getWordle()
const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "«",
]

let guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
]

const congratulatoryWords = [
  "Magnificent",
  "Amazing",
  "Good Job",
  "Great",
  "Sweet",
  "Nice",
  "Incredible",
  "Way to go!",
  "Awesome",
  "Congratulations",
  "You did it!",
  "Bravo",
  "Fantastic",
  "Sensational",
  "Well done",
  "Nice going",
  "You rock!",
  "You’ve got it",
  "This is the way",
]

let currentRow = 0
let currentTile = 0
let isGameOver = false

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none"
}
noBtn.onclick = function () {
  modal.style.display = "none"
}

yesBtn.addEventListener("click", () => {
  modal.style.display = "none"
  newGame()
})

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none"
  }
}

// Handle keyboard input
document.addEventListener("keydown", (event) => {
  const keyName = event.key.toUpperCase()
  if (keys.includes(keyName) || keyName == "BACKSPACE") {
    handleKeyPress(keyName)
  }
})

const handleKeyPress = (key) => {
  if (!isGameOver) {
    if (key === "BACKSPACE") {
      removeLetter()
      return
    }
    if (key === "ENTER") {
      checkRow()
      return
    }
    addLetter(key)
  }
}

const newGame = () => {
  window.location.reload()
}

// initiate tiles
guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement("div")
  rowElement.setAttribute("id", `guessRow-${guessRowIndex}`)
  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement("div")
    tileElement.setAttribute(
      "id",
      `guessRow-${guessRowIndex}-tile-${guessIndex}`
    )
    tileElement.classList.add("tile")
    rowElement.append(tileElement)
  })
  tilesContainer.append(rowElement)
})

// initiate keyboard keys
keys.forEach((key, index) => {
  const buttonElement = document.createElement("button")
  buttonElement.dataset.key = key.toLowerCase()
  buttonElement.setAttribute("id", key)
  if (key === "«") {
    buttonElement.textContent = "BACKSPACE"
    buttonElement.addEventListener("click", () => handleClick("BACKSPACE"))
  } else {
    buttonElement.addEventListener("click", () => handleClick(key))
    buttonElement.innerHTML = key
  }
  keyContainer.append(buttonElement)
})

const handleClick = (key) => {
  if (!isGameOver) {
    if (key === "BACKSPACE") {
      console.log("BACKSPACE HIT")
      removeLetter()
      return
    }
    if (key === "ENTER") {
      checkRow()
      return
    }
    addLetter(key)
  }
}

const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      `guessRow-${currentRow}-tile-${currentTile}`
    )
    tile.classList.toggle("highlight-tile")
    tile.textContent = letter
    guessRows[currentRow][currentTile] = letter
    tile.setAttribute("data", letter)
    currentTile++
  }
}

const removeLetter = () => {
  if (currentTile > 0) {
    currentTile--
    const previousTile = document.getElementById(
      `guessRow-${currentRow}-tile-${currentTile}`
    )
    previousTile.classList.toggle("highlight-tile")
    previousTile.textContent = ""
    guessRows[currentRow][currentTile] = ""
    previousTile.setAttribute("data", "")
  }
}

const checkRow = () => {
  const guess = guessRows[currentRow].join("")
  if (currentTile > 4) {
    // fetch(`http://localhost:3000/check/?word=${guess}`)
    fetch(`/check/?word=${guess}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.title == "No Definitions Found") {
          showMessage("Word is not in the list")
          shakeTile()
          return
        } else {
          flipTile()
          if (wordle == guess) {
            showMessage(
              congratulatoryWords[
                Math.floor(Math.random() * congratulatoryWords.length)
              ]
            )
            isGameOver = true
            wordToGuess.textContent = wordle.toUpperCase()
            setTimeout(() => {
              modal.style.display = "block"
            }, 3000)
            return
          } else {
            if (currentRow >= 5) {
              isGameOver = true
              showMessage("Game Over")
              wordToGuess.textContent = wordle.toUpperCase()
              setTimeout(() => {
                modal.style.display = "block"
              }, 3000)

              return
            }
            if (currentRow < 5) {
              currentRow++
              currentTile = 0
            }
          }
        }
      })
      .catch((err) => console.log(err))
  }
}

const showMessage = (message) => {
  const messageElement = document.createElement("p")
  if (message !== "Game Over") {
    messageElement.textContent = message
    messageDisplay.append(messageElement)
    setTimeout(() => {
      messageDisplay.removeChild(messageElement)
    }, 3000)
  } else {
    messageElement.textContent = wordle.toUpperCase()
    messageDisplay.append(messageElement)

    setTimeout(() => {
      modal.style.display = "block"
    }, 4000)
  }
}

const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter)
  key.classList.add(color)
}

const flipTile = () => {
  const rowTiles = document.querySelector(`#guessRow-${currentRow}`).childNodes
  let checkWordle = wordle
  const guess = []

  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute("data"), color: "grey-overlay" })
  })

  guess.forEach((guess, index) => {
    if (guess.letter == wordle[index]) {
      guess.color = "green-overlay"
      checkWordle = checkWordle.replace(guess.letter, "")
    }
  })

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "yellow-overlay"
      checkWordle = checkWordle.replace(guess.letter, "")
    }
  })

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.remove("highlight-tile")
      tile.classList.add("flip")
      tile.classList.add(guess[index].color)
      addColorToKey(guess[index].letter, guess[index].color)
    }, 500 * index)
  })
}

const shakeTile = () => {
  const rowTiles = document.querySelector(`#guessRow-${currentRow}`).childNodes
  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("shake")
    }, 500 * index)
  })
}
