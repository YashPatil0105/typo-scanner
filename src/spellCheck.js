const spellchecker = require("spellchecker");

function checkWord(word) {
  // Returns an array of suggested corrections if the word is misspelled.
  return spellchecker.isMisspelled(word)
    ? spellchecker.getCorrectionsForMisspelling(word)
    : [];
}

module.exports = { checkWord };
