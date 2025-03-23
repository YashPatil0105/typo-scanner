#!/usr/bin/env node
const { analyzeFile } = require('./index');
const path = require("path");
const { generateHTMLReport } = require('./htmlReport');

// Log current working directory for debugging
console.log("Current working directory:", process.cwd());

const filePath = process.argv[2];
if (!filePath) {
  console.error("Please provide a file path to analyze.");
  process.exit(1);
}

const results = analyzeFile(filePath);
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

// Generate the HTML report in the same directory as the analyzed file
const reportPath = path.resolve(path.dirname(filePath), "report.html");
generateHTMLReport(filePath, results, reportPath);
console.log(`HTML report generated at: ${reportPath}`);
