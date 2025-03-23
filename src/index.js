const { parseFile } = require("./parser");
const { extractIdentifiers } = require("./traverse");
const { checkWord } = require("./spellCheck");
const path = require("path");
const { generateHTMLReport } = require("./htmlReport");

/**
 * Analyzes the given file for potential typos in identifiers,
 * aggregates duplicate occurrences, and filters out words from a whitelist.
 *
 * @param {string} filePath - The path to the file to analyze.
 * @returns {Array} Array of objects with properties:
 *   - word: the misspelled word
 *   - count: number of occurrences
 *   - suggestions: array of correction suggestions
 */
function analyzeFile(filePath) {
  // Parse the file and extract all identifiers
  const { ast, code} = parseFile(filePath);
  const { identifiers, codeLines } = extractIdentifiers({ ast, code});

  // Whitelist of words to ignore (commonly used method names, etc.)
  const whitelist = [
    // Array methods
    "forEach", "map", "filter", "reduce", "push", "pop", "shift", "unshift",
    "slice", "splice", "concat", "join", "indexOf", "lastIndexOf", "includes",
    "find", "findIndex", "sort", "reverse", "every", "some", "fill", "copyWithin",
  
    // String methods
    "charAt", "charCodeAt", "concat", "includes", "endsWith", "indexOf", "lastIndexOf",
    "match", "replace", "search", "slice", "split", "startsWith", "substr", "substring",
    "toLowerCase", "toUpperCase", "trim", "trimStart", "trimEnd", "padStart", "padEnd",
  
    // Object methods
    "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "toLocaleString",
    "toString", "valueOf", "assign", "create", "entries", "freeze", "keys", "seal",
    "values", "getPrototypeOf", "setPrototypeOf", "defineProperty", "defineProperties",
  
    // Math methods
    "abs", "acos", "asin", "atan", "atan2", "ceil", "cos", "exp", "floor", "log",
    "max", "min", "pow", "random", "round", "sin", "sqrt", "tan", "trunc", "clz32", "imul",
  
    // Date methods
    "getDate", "getDay", "getFullYear", "getHours", "getMilliseconds", "getMinutes",
    "getMonth", "getSeconds", "getTime", "getTimezoneOffset", "getUTCDate", "getUTCDay",
    "getUTCFullYear", "getUTCHours", "getUTCMilliseconds", "getUTCMinutes", "getUTCMonth",
    "getUTCSeconds", "setDate", "setFullYear", "setHours", "setMilliseconds", "setMinutes",
    "setMonth", "setSeconds", "setTime", "toDateString", "toISOString", "toJSON",
    "toLocaleDateString", "toLocaleTimeString", "toTimeString", "toUTCString",
  
    // Global objects and functions
    "Array", "Boolean", "Date", "Error", "Function", "JSON", "Math", "Number",
    "Object", "RegExp", "String", "Symbol", "Map", "Set", "WeakMap", "WeakSet",
    "Promise", "Intl", "BigInt", "Proxy", "Reflect",
  
    // Node.js specific globals
    "require", "module", "exports", "__dirname", "__filename", "Buffer", "process",
    "console", "setTimeout", "clearTimeout", "setInterval", "clearInterval",
    "setImmediate", "clearImmediate",
  
    // Browser-specific globals (if applicable)
    "window", "document", "navigator", "alert", "confirm", "prompt",
  
    // Console methods
    "log", "warn", "error", "info", "debug", "assert", "dir", "trace", "time", "timeEnd",
  
    // Other common terms
    "parseInt", "parseFloat", "isNaN", "isFinite", "eval", "encodeURI", "encodeURIComponent",
    "decodeURI", "decodeURIComponent"
  ];
  

  // Use an object to aggregate duplicate typos
  const typosMap = {};

//   identifiers.forEach((word) => {
//     // Skip words on the whitelist
//     if (whitelist.includes(word)) return;

//     // Check if the word is misspelled (i.e., has suggestions)
//     const suggestions = checkWord(word);
//     if (suggestions.length > 0) {
//       // If it's the first time, create an entry for the word
//       if (!typosMap[word]) {
//         typosMap[word] = {
//           word: word,
//           count: 0,
//           suggestions: suggestions,
//         };
//       }
//       // Increment the count of occurrences
//       typosMap[word].count += 1;
//     }
//   });
identifiers.forEach(({ name, loc }) => {
    if (whitelist.includes(name)) return;
    const suggestions = checkWord(name);
    if (suggestions.length > 0) {
      if (!typosMap[name]) {
        typosMap[name] = {
          word: name,
          count: 0,
          suggestions,
          occurrences: [] // store occurrence details
        };
      }
      typosMap[name].count += 1;
      typosMap[name].occurrences.push({
        line: loc.start.line,
        column: loc.start.column,
        snippet: codeLines[loc.start.line - 1] // get the specific line
      });
    }
  });

  // Convert the aggregated results to an array
  return Object.values(typosMap);
}

// For CLI usage
if (require.main === module) {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("Please provide a file path to analyze.");
    process.exit(1);
  }
  const results = analyzeFile(filePath);
//   console.log(JSON.stringify(result, null, 2));
console.log("Console-based Analysis:");
results.forEach(result => {
    console.log(`Word: ${result.word}`);
    console.log(`Occurrences: ${result.count}`);
    console.log(`Suggestions: ${result.suggestions.join(", ")}`);
    result.occurrences.forEach(({ line, column, snippet }) => {
      console.log(`-> At line ${line}, column ${column}`);
      console.log(`   ${snippet}`);
    });
    console.log("-----");
  });

 
    generateHTMLReport(filePath, results);
  

}

module.exports = { analyzeFile };
