// const traverse = require("@babel/traverse").default;

// function extractIdentifiers(ast) {
//   const identifiers = [];
//   traverse(ast, {
//     Identifier(path) {
//       identifiers.push(path.node.name);
//     },
//   });
//   return identifiers;
// }

// module.exports = { extractIdentifiers };
const traverse = require("@babel/traverse").default;

function extractIdentifiers({ ast, code }) {
  const identifiers = [];
  traverse(ast, {
    Identifier(path) {
      // Record identifier name and its location info
      identifiers.push({
        name: path.node.name,
        loc: path.node.loc,
      });
    },
  });
  // Also return the code lines for context
  const codeLines = code.split('\n');
  return { identifiers, codeLines };
}

module.exports = { extractIdentifiers };
