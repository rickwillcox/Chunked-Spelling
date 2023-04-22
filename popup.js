const colorSchemes = [
  ["#686868", "#A0C6FC", "#C7D8F7"],
  ["#4F4F4F", "#FFB347", "#FFE7AE"],
  ["#484848", "#B19CD9", "#F6D1FF"],
  ["#4A4A4A", "#CB99C9", "#E4B4E6"],
  ["#434343", "#DEA5A4", "#F2C6C5"],
  ["#4E4E4E", "#FDFD96", "#FFF8AE"],
  ["#4C4C4C", "#F0EAD6", "#FFF6C7"],
  ["#464646", "#FFAB91", "#FFD2B9"],
  ["#4B4B4B", "#C8E6C9", "#F1FFE7"],
  ["#444444", "#D1C4E9", "#F5EDFF"],
  ["#5D5D5D", "#9AA0A6", "#D2D7DC"],
  ["#5B5B5B", "#A0C6FC", "#D5E9FC"],
  ["#545454", "#B2EBF2", "#E0F7FA"],
  ["#555555", "#FFCCBC", "#FFE0B2"],
  ["#525252", "#E8F5E9", "#F1F8E9"],
  ["#515151", "#C5CAE9", "#E8EAF6"],
  ["#585858", "#D7CCC8", "#EFEBE9"],
  ["#535353", "#E0F2F1", "#F1F8F7"],
  ["#575757", "#FFE0B2", "#FFF3D9"],
  ["#505050", "#F8BBD0", "#FFCDD2"],
  ["#595959", "#C5E1A5", "#E8F5E9"],
  ["#555555", "#BDBDBD", "#E0E0E0"],
  ["#565656", "#90CAF9", "#B3E5FC"],
  ["#585858", "#FFD180", "#FFECB3"],
  ["#5A5A5A", "#A7FFEB", "#B2EBF2"],
  ["#575757", "#B39DDB", "#D1C4E9"],
  ["#535353", "#B2DFDB", "#E0F2F1"],
  ["#525252", "#FFE082", "#FFECB3"],
  ["#595959", "#E6EE9C", "#F0F4C3"],
  ["#555555", "#FF8A65", "#FFAB91"],
];

function changeTitleScheme(schemeIndex) {
  const titleWordOne = document.querySelector(".title-word-0");
  titleWordOne.style.backgroundColor = colorSchemes[schemeIndex][0];
  const titleWordTwo = document.querySelector(".title-word-1");
  titleWordTwo.style.backgroundColor = colorSchemes[schemeIndex][0];
  const oddWords = document.querySelectorAll(".odd-word");
  oddWords.forEach((word) => {
    word.style.color = colorSchemes[schemeIndex][1];
  });
  const evenWords = document.querySelectorAll(".even-word");
  evenWords.forEach((word) => {
    word.style.color = colorSchemes[schemeIndex][2];
  });
}

function saveColorScheme(schemeIndex) {
  chrome.storage.local.set({ colorScheme: colorSchemes[schemeIndex] });
  changeTitleScheme(schemeIndex);
}

const titleSplit = [
  ["Ch", "unk", "ed "],
  ["Spell", "ing"],
];

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("color-scheme-form");
  const title = document.createElement("h1");
  title.className = "title";
  titleSplit.forEach((word, i) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = `title-word title-word-${i}`;
    word.forEach((chunk, index) => {
      const span = document.createElement("span");
      span.className = index % 2 === 0 ? `even-word` : `odd-word`;
      span.textContent = chunk;
      wordSpan.appendChild(span);
    });
    title.appendChild(wordSpan);
  });
  form.appendChild(title);

  colorSchemes.forEach((scheme, index) => {
    const div = document.createElement("div");
    div.className = "color-scheme";
    div.dataset.index = index;
    div.style.border = "3px solid transparent"; // Add transparent border by default

    // Click event to handle selection
    div.addEventListener("click", (e) => {
      // Remove selected class and set border to transparent for all color-scheme elements
      document.querySelectorAll(".color-scheme").forEach((elem) => {
        elem.classList.remove("selected");
        elem.style.border = "3px solid transparent";
      });

      // Add selected class and set border to solid for the clicked element
      e.currentTarget.classList.add("selected");
      // e.currentTarget.style.border = "3px solid black";
      e.currentTarget.style.border = "3px dashed white";

      // Save the selected color scheme using the index
      saveColorScheme(index);
    });

    scheme.forEach((color) => {
      const square = document.createElement("div");
      square.className = "color-square";
      square.style.backgroundColor = color;
      div.appendChild(square);
    });

    form.appendChild(div);
  });

  // loadColorScheme();
});
