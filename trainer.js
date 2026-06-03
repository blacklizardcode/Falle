let messages
let correctAnswer
let jsonData
let caseChip
let setChip
let genderChip
let promptText
let checkButton
let hintButton
let input
let items

async function readJsonFile(filePath) {
  try {
    const response = await fetch(filePath)

    if (!response.ok) {
      throw new Error(`Failed to load file: ${response.status}`)
    }

    const jsonData = await response.json()
    return jsonData
  } catch (error) {
    console.error("Error reading JSON file:", error)
    throw error
  }
}

function createMessage(text, subtext, level) {
  const messageContainer = document.createElement("div")
  const messageTitle = document.createElement("p")
  const messageDesc = document.createElement("p")

  messageTitle.classList.add("messageTitle")
  messageDesc.classList.add("messageDesc")
  messageContainer.classList.add("message")
  messageTitle.innerText = text
  messageDesc.innerText = subtext

  if (level === 1) {
    messageContainer.classList.add("messageRed")
  } else if (level === 2) {
    messageContainer.classList.add("messageYellow")
  } else if (level === 3) {
    messageContainer.classList.add("messageGreen")
  }

  messageContainer.appendChild(messageTitle)
  messageContainer.appendChild(messageDesc)
  messages.appendChild(messageContainer)

  setTimeout(() => {
    messageContainer.classList.add("removing")
    messageContainer.addEventListener(
      "animationend",
      () => {
        messageContainer.remove()
      },
      { once: true }
    )
  }, 10000)
}

function normalizeAnswer(value) {
  return value.trim().toLowerCase()
}

function generateNewQuestion() {
  const randomItem = items[Math.floor(Math.random() * items.length)]

  caseChip.innerText = randomItem.case
  setChip.innerText = randomItem.set
  genderChip.innerText = randomItem.gender || "unknown"
  promptText.innerText = randomItem.prompt
  input.value = ""

  return randomItem.answer
}

function checkAnswer() {
  if (normalizeAnswer(input.value) === normalizeAnswer(correctAnswer)) {
    input.classList.remove("wrong")
    input.classList.add("correct")
    setTimeout(() => {
      input.classList.remove("correct")
    }, 500)
    correctAnswer = generateNewQuestion()
  } else {
    input.classList.remove("correct")
    input.classList.add("wrong")
  }
}

function hint() {
  input.value = correctAnswer
}

function loadSelections() {
  const params = new URLSearchParams(window.location.search)
  const selectedCases = params.get("cases")?.split(",").filter(Boolean) || []
  const selectedSets = params.get("sets")?.split(",").filter(Boolean) || []

  if (selectedCases.length === 0) {
    createMessage("No cases selected", "Using all cases.", 2)
  }

  if (selectedSets.length === 0) {
    createMessage("No sets selected", "Using all sentence sets.", 2)
  }

  const casesFilter = selectedCases.length ? selectedCases : jsonData.metadata.cases
  const setsFilter = selectedSets.length ? selectedSets : jsonData.metadata.sets

  items = jsonData.items.filter((item) => casesFilter.includes(item.case) && setsFilter.includes(item.set))

  if (items.length === 0) {
    createMessage("No matches", "Pick more cases or sets.", 1)
    return false
  }

  return true
}

async function main() {
  messages = document.getElementById("messages")
  caseChip = document.getElementById("caseChip")
  setChip = document.getElementById("setChip")
  genderChip = document.getElementById("genderChip")
  promptText = document.getElementById("promptText")
  checkButton = document.getElementById("check")
  hintButton = document.getElementById("hint")
  input = document.getElementById("input")

  jsonData = await readJsonFile("./sentences.json")

  if (!loadSelections()) {
    return
  }

  correctAnswer = generateNewQuestion()

  checkButton.addEventListener("click", checkAnswer)
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      checkAnswer()
    }
  })
  hintButton.addEventListener("click", hint)
}

document.addEventListener("DOMContentLoaded", main)
