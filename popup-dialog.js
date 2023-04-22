const wordsToChange = {
  accommodate: "ac-com-mo-date",
  accommodation: "ac-com-mo-da-tion",
  amateur: "am-ate-ur",
  appropriate: "ap-pro-pri-ate",
  assassin: "ass-ass-in",
  assessment: "as-sess-ment",
  biography: "bio-graph-y",
  calendar: "cal-en-dar",
  cannabis: "can-na-bis",
  commission: "com-miss-ion",
  committed: "com-mit-ted",
  conscientious: "con-sci-en-ti-ous",
  consensus: "con-sen-sus",
  convenient: "con-ven-i-ent",
  definitely: "de-fin-ite-ly",
  exhilarate: "ex-hil-a-rate",
  fiery: "fi-er-y",
  guarantee: "gu-aran-tee",
  harass: "har-ass",
  hierarchy: "hi-er-arch-y",
  immediate: "im-med-i-ate",
  indispensable: "in-dis-pens-able",
  jewelry: "jewel-ry",
  judgment: "judg-ment",
  leisure: "le-is-ure",
  maintenance: "main-ten-ance",
  maneuver: "man-eu-ver",
  marijuana: "mar-i-ju-ana",
  millennium: "mil-len-ni-um",
  minuscule: "min-us-cule",
  mischievous: "mis-chi-e-v-ous",
  misspell: "mis-spell",
  occasionally: "oc-ca-sion-al-ly",
  occurred: "oc-cur-red",
  occurrence: "oc-cur-r-ence",
  parallel: "par-all-el",
  perseverance: "per-se-ver-ance",
  personnel: "per-son-nel",
  possession: "pos-ses-sion",
  precede: "pre-cede",
  principal: "prin-cip-al",
  privilege: "priv-i-lege",
  pronunciation: "pro-nun-ci-a-tion",
  questionnaire: "quest-ion-na-ire",
  receipt: "re-ce-ipt",
  referred: "re-fer-red",
  separate: "sep-a-rate",
  sergeant: "ser-ge-ant",
  succinct: "suc-cin-ct",
  supersede: "super-sed-e",
  threshold: "thresh-old",
  transparent: "trans-par-ent",
  twelfth: "twe-l-f-th",
  unnecessary: "un-ne-c-es-sary",
  vacuum: "vac-u-um",
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

  document
    .querySelector(".add-btn")
    .addEventListener("click", function (event) {
      positionAddDialog(event.target);
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
    const deleteButton = event.target.closest(".delete-btn");
    const editButton = event.target.closest(".edit-btn");

    if (deleteButton) {
      const word = deleteButton.getAttribute("data-word");
      deleteWord(word);
    } else if (editButton) {
      const word = editButton.getAttribute("data-word");
      positionEditDialog(event.target);
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
    const wordElem = document.createElement("tr");
    wordElem.innerHTML = `
          <td class="word">${word}</td>
          <td class="separator">:</td>
          <td class="replacement">${replacement}</td>
          <td class="action-icons">
            <button class="edit-btn" data-word="${word}">
              <div class="icon-container">
                <img src="Pen.png" alt="Edit" />
              </div>
            </button>
            <button class="delete-btn" data-word="${word}">
              <div class="icon-container">
                <img src="trash-alt.png" alt="Delete" />
              </div>
            </button>
          </td>
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

function positionAddDialog(target) {
  const addDialog = document.querySelector(".add-dialog");
  const rect = target.getBoundingClientRect();
  addDialog.style.top = rect.top + window.scrollY - 150 + "px";
  addDialog.style.left = rect.left + window.scrollX + 200 + "px";
}

function positionEditDialog(target) {
  const addDialog = document.querySelector(".edit-dialog");
  const rect = target.getBoundingClientRect();
  addDialog.style.top = rect.top + window.scrollY - 109 + "px";
  addDialog.style.left = rect.left + window.scrollX - 225 + "px";
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
