// const parser = require("@babel/parser");
// const fs = require("fs");

// function parseFile(filePath) {
//   const code = fs.readFileSync(filePath, "utf8");
//   return parser.parse(code, { sourceType: "module", plugins: ["jsx"] });
// }

// module.exports = { parseFile };
const parser = require("@babel/parser");
const fs = require("fs");

function parseFile(filePath) {
  const code = fs.readFileSync(filePath, "utf8");
  return {
    ast: parser.parse(code, {
      sourceType: "module",
      plugins: ["jsx"],
      locations: true, // enable location data
    }),
    code, // return raw code as well
  };
}

module.exports = { parseFile };
