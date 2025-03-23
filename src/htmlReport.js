// htmlReport.js
const fs = require("fs");
const path = require("path");

/**
 * Generates an HTML report with highlighted typos in a dark-themed style.
 *
 * @param {string} filePath - The path of the analyzed file.
 * @param {Array} analysisResults - The array of typo objects from analyzeFile().
 */
function generateHTMLReport(filePath, analysisResults) {
  // Read raw file content
  const code = fs.readFileSync(filePath, "utf8");
  const codeLines = code.split("\n");

  // Build a mapping of line numbers to error markers
  const errorMap = {};
  analysisResults.forEach(result => {
    result.occurrences.forEach(({ line, column }) => {
      if (!errorMap[line]) {
        errorMap[line] = [];
      }
      errorMap[line].push({
        word: result.word,
        suggestions: result.suggestions,
        column
      });
    });
  });

  // Build the HTML content
  let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Report for ${path.basename(filePath)}</title>
  <style>
    /* Basic reset */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background-color: #1e1e1e; /* Dark theme background */
      color: #d4d4d4;            /* VS Code-like text color */
      font-family: Consolas, "Courier New", monospace;
      margin: 0;
      padding: 0;
    }

    header {
      background: #2d2d2d;
      padding: 1rem;
      text-align: center;
      border-bottom: 1px solid #3c3c3c;
    }

    header h1 {
      color: #ffffff;
      margin: 0;
    }

    .container {
      max-width: 1000px;
      margin: 1rem auto;
      padding: 0 1rem;
    }

    pre {
      background: #252526;  /* Another dark shade for code block */
      padding: 1rem;
      overflow-x: auto;
      border-radius: 4px;
      line-height: 1.5;
      margin-top: 1rem;
      color: #d4d4d4;
      position: relative;
    }

    .line {
      display: block;
      white-space: pre;
    }

    .line-number {
      color: #858585;
      margin-right: 1rem;
      user-select: none;
    }

    /* Error highlighting */
    .error {
      background-color: #c75e5e; /* A red-tinted background for typos */
      color: #ffffff;
      padding: 1px 2px;
      border-radius: 2px;
      cursor: pointer;
      position: relative;
    }

    /* Tooltip container */
    .tooltip {
      position: relative;
      display: inline-block;
    }

    /* Tooltip text */
    .tooltip .tooltiptext {
      visibility: hidden;
      max-width: 300px;
      background-color: #3c3c3c;
      color: #ffffff;
      text-align: left;
      border-radius: 4px;
      padding: 0.5rem;
      position: absolute;
      z-index: 999;
      /* Position the tooltip to the right */
      top: 50%;
      left: 105%;
      transform: translateY(-50%);
      opacity: 0;
      transition: opacity 0.2s ease-in-out;
      font-size: 0.9rem;
      border: 1px solid #555;
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      white-space: normal; /* Allow line wraps inside tooltip */
    }

    .tooltip:hover .tooltiptext {
      visibility: visible;
      opacity: 1;
    }

    .tooltip-title {
      font-weight: bold;
      margin-bottom: 0.2rem;
    }

    .suggestion-list {
      margin: 0.3rem 0 0 1rem;
      padding: 0;
    }

    .suggestion-list li {
      list-style: disc;
      margin-left: 1rem;
    }
  </style>
</head>
<body>
  <header>
    <h1>Report for ${path.basename(filePath)}</h1>
  </header>
  <div class="container">
    <pre>
`;

  // Process each line from the code, adding line numbers and error markers
  codeLines.forEach((lineContent, index) => {
    const lineNumber = index + 1;
    let modifiedLine = lineContent;

    if (errorMap[lineNumber]) {
      // Process each error in reverse order to avoid messing up indexes
      errorMap[lineNumber].sort((a, b) => b.column - a.column).forEach(error => {
        const suggestionsHTML = `
          <div class="tooltip-title">Word: ${error.word}</div>
          <div>Suggestions:</div>
          <ul class="suggestion-list">
            ${error.suggestions.map(s => `<li>${s}</li>`).join("")}
          </ul>
        `;
        const regex = new RegExp(error.word);
        modifiedLine = modifiedLine.replace(
          regex,
          `<span class="tooltip error">${error.word}<span class="tooltiptext">${suggestionsHTML}</span></span>`
        );
      });
    }

    htmlContent += `<span class="line"><span class="line-number">${lineNumber.toString().padStart(3, ' ')}</span> ${modifiedLine}</span>\n`;
  });

  htmlContent += `
    </pre>
  </div>
</body>
</html>
`;

  // Write the HTML content to a file
  const reportPath = path.join(process.cwd(), "report.html");
  fs.writeFileSync(reportPath, htmlContent, "utf8");
  console.log(`HTML report generated: ${reportPath}`);
}

module.exports = { generateHTMLReport };
