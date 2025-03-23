#!/usr/bin/env node
const { analyzeFile } = require('./index');

// Get the file path from the command line arguments
const filePath = process.argv[2];

if (!filePath) {
  console.error('Please provide a file path to analyze.');
  process.exit(1);
}

try {
  const results = analyzeFile(filePath);
  console.log(JSON.stringify(results, null, 2));
} catch (err) {
  console.error('Error analyzing file:', err);
  process.exit(1);
}
