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

function addCases(data, casesBox) {
  for (const i in data.metadata.cases) {
    const caseHtml = `<label class="checkbox"><input type="checkbox" name="${data.metadata.cases[i]}"><span class="checkmark"></span>${data.metadata.cases[i]}</label>`
    casesBox.insertAdjacentHTML("beforeend", caseHtml)
  }
}

function addSets(data, setsBox) {
  for (const i in data.metadata.sets) {
    const setHtml = `<label class="checkbox"><input type="checkbox" name="${data.metadata.sets[i]}"><span class="checkmark"></span>${data.metadata.sets[i]}</label>`
    setsBox.insertAdjacentHTML("beforeend", setHtml)
  }
}

function collectCheckedValues(container) {
  const values = []
  const checkboxes = container.querySelectorAll('input[type="checkbox"]')
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      values.push(checkbox.name)
    }
  })
  return values
}

async function main() {
  const data = await readJsonFile("./sentences.json")
  const casesBox = document.getElementById("cases")
  const setsBox = document.getElementById("sets")

  addCases(data, casesBox)
  addSets(data, setsBox)

  const doneButton = document.getElementById("doneButton")
  doneButton.addEventListener("click", () => {
    const cases = collectCheckedValues(casesBox)
    const sets = collectCheckedValues(setsBox)

    const params = new URLSearchParams()
    params.set("cases", cases.join(","))
    params.set("sets", sets.join(","))

    window.location.href = "trainer.html?" + params.toString()
  })
}

document.addEventListener("DOMContentLoaded", main)
