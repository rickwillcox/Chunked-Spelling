const defaultColorScheme = ["#636261", "#AEC6CF", "#F4A460"];

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

const originalBody = document.body.cloneNode(true);

chrome.storage.sync.get("colorScheme", (data) => {
  const colorScheme = data.colorScheme || defaultColorScheme;
  replaceWordsInPage(colorScheme);
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.colorScheme) {
    const colorScheme = changes.colorScheme.newValue;
    document.body = originalBody.cloneNode(true);
    replaceWordsInPage(colorScheme);
  }
});

function replaceWordsInPage(colorScheme) {
  function createColoredSpan(text, color) {
    const span = document.createElement("span");
    span.textContent = text;
    span.style.color = color;
    return span;
  }

  function replaceWords(textNode, colorScheme) {
    const originalText = textNode.textContent;
    let hasReplacements = false;

    for (const word in wordsToChange) {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      if (regex.test(originalText)) {
        hasReplacements = true;
      }
    }

    if (hasReplacements) {
      const parentNode = textNode.parentNode;
      const words = originalText.split(" ");
      const fragment = document.createDocumentFragment();

      words.forEach((word, wordIndex) => {
        if (wordIndex > 0) {
          fragment.appendChild(document.createTextNode(" "));
        }

        const lowerCaseWord = word.toLowerCase();
        if (wordsToChange[lowerCaseWord]) {
          const parts = wordsToChange[lowerCaseWord].split("-");
          const wrapperSpan = document.createElement("span");
          wrapperSpan.style.backgroundColor = colorScheme[0];
          wrapperSpan.style.borderRadius = "3px";
          wrapperSpan.style.padding = "0 5px";
          parts.forEach((part, index) => {
            const color = colorScheme[(index % 2) + 1];
            wrapperSpan.appendChild(createColoredSpan(part, color));
          });
          fragment.appendChild(wrapperSpan);
        } else {
          fragment.appendChild(document.createTextNode(word));
        }
      });

      parentNode.insertBefore(fragment, textNode);
      textNode.remove();
    }
  }

  function walk(node, colorScheme) {
    let child, next;

    if (
      node.nodeName.toLowerCase() == "input" ||
      node.nodeName.toLowerCase() == "textarea" ||
      (node.classList && node.classList.contains("ace_editor"))
    ) {
      return;
    }

    switch (node.nodeType) {
      case 1:
      case 9:
      case 11:
        child = node.firstChild;
        while (child) {
          next = child.nextSibling;
          walk(child, colorScheme);
          child = next;
        }
        break;
      case 3:
        replaceWords(node, colorScheme);
        break;
    }
  }

  walk(document.body, colorScheme);
}
