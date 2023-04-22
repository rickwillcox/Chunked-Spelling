const wordsToChange = {
  accommodate: "ac-com-mo-date",
  accommodation: "ac-com-mo-da-tion",
  amateur: "am-ate-ur",
  appropriate: "ap-pro-pri-ate",
  assassin: "ass-ass-in",
  assessment: "as-sess-ment",
};

let wordList = {};

function init() {
  chrome.storage.local.get("wordList", function (data) {
    if (data.wordList) {
      wordList = data.wordList;
    } else {
      wordList = wordsToChange;
    }
    displayWordList();
  });

  document.querySelector(".add-btn").addEventListener("click", function () {
    showAddDialog();
  });

  document.querySelector(".reset-btn").addEventListener("click", function () {
    wordList = wordsToChange;
    saveWordList();
    displayWordList();
  });

  document
    .querySelector(".delete-all-btn")
    .addEventListener("click", function () {
      wordList = {};
      saveWordList();
      displayWordList();
    });

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
      const word = event.target.getAttribute("data-word");
      deleteWord(word);
    } else if (event.target.classList.contains("edit-btn")) {
      const word = event.target.getAttribute("data-word");
      showEditDialog(word);
    }
  });

  document
    .querySelector(".edit-save-btn")
    .addEventListener("click", function () {
      const word = document.querySelector(".edit-word-input").value.trim();
      const replacement = document
        .querySelector(".edit-replacement-input")
        .value.trim();
      if (word && replacement) {
        editWord(word, replacement);
      }
    });

  document
    .querySelector(".edit-cancel-btn")
    .addEventListener("click", function () {
      hideDialog(".edit-dialog");
    });

  document
    .querySelector(".add-save-btn")
    .addEventListener("click", function () {
      const word = document.querySelector(".add-word-input").value.trim();
      const replacement = document
        .querySelector(".add-replacement-input")
        .value.trim();
      if (word && replacement) {
        addWord(word, replacement);
      }
    });

  document
    .querySelector(".add-cancel-btn")
    .addEventListener("click", function () {
      hideDialog(".add-dialog");
    });
}

function displayWordList() {
  const wordListElem = document.querySelector(".word-list");
  wordListElem.innerHTML = "";
  for (const [word, replacement] of Object.entries(wordList)) {
    const wordElem = document.createElement("li");
    wordElem.innerHTML = `
      <span class="word">${word}</span>
      <span class="separator">:</span>
      <span class="replacement">${replacement}</span>
      <button class="edit-btn" data-word="${word}">Edit</button>
      <button class="delete-btn" data-word="${word}">Delete</button>
    `;
    wordListElem.appendChild(wordElem);
  }
}

function deleteWord(word) {
  delete wordList[word];
  saveWordList();
  displayWordList();
}

function showEditDialog(word) {
  const replacement = wordList[word];
  document.querySelector(".edit-word-input").value = word;
  document.querySelector(".edit-replacement-input").value = replacement;
  showDialog(".edit-dialog");
}

function editWord(word, replacement) {
  wordList[word] = replacement;
  saveWordList();
  displayWordList();
  hideDialog(".edit-dialog");
}

function showAddDialog() {
  document.querySelector(".add-word-input").value = "";
  document.querySelector(".add-replacement-input").value = "";
  showDialog(".add-dialog");
}

function addWord(word, replacement) {
  if (!wordList.hasOwnProperty(word)) {
    wordList[word] = replacement;
    saveWordList();
    displayWordList();
    hideDialog(".add-dialog");
  } else {
    alert("The word already exists in the list.");
  }
}

function saveWordList() {
  chrome.storage.local.set({ wordList: wordList });
}

function showDialog(selector) {
  document.querySelector(selector).style.display = "block";
}

function hideDialog(selector) {
  document.querySelector(selector).style.display = "none";
}

init();
