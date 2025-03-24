// htmlReport.js
const fs = require("fs");
const path = require("path");

function generateHTMLReport(filePath, analysisResults, reportPath) {
  try {
    // Read the source file
    const code = fs.readFileSync(filePath, "utf8");
    const codeLines = code.split("\n");

    // Build error map: mapping line number to errors on that line
    const errorMap = {};
    analysisResults.forEach(result => {
      result.occurrences.forEach(({ line, column }) => {
        if (!errorMap[line]) errorMap[line] = [];
        errorMap[line].push({
          word: result.word,
          suggestions: result.suggestions,
          column: column
        });
      });
    });

    // Build HTML content with dark theme
    let htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Report for ${path.basename(filePath)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background-color: #1e1e1e; color: #d4d4d4; font-family: Consolas, "Courier New", monospace; }
    header { background: #2d2d2d; padding: 1rem; text-align: center; border-bottom: 1px solid #3c3c3c; }
    header h1 { color: #ffffff; }
    .container { max-width: 1000px; margin: 1rem auto; padding: 0 1rem; }
    pre { background: #252526; padding: 1rem; overflow-x: auto; border-radius: 4px; line-height: 1.5; margin-top: 1rem; color: #d4d4d4; position: relative; }
    .line { display: block; white-space: pre; }
    .line-number { color: #858585; margin-right: 1rem; user-select: none; }
    .error { background-color: #c75e5e; color: #ffffff; padding: 1px 2px; border-radius: 2px; cursor: pointer; position: relative; }
    .tooltip { position: relative; display: inline-block; }
    .tooltip .tooltiptext {
      visibility: hidden; max-width: 300px; background-color: #3c3c3c; color: #ffffff;
      text-align: left; border-radius: 4px; padding: 0.5rem; position: absolute; z-index: 999;
      top: 50%; left: 105%; transform: translateY(-50%);
      opacity: 0; transition: opacity 0.2s ease-in-out; font-size: 0.9rem;
      border: 1px solid #555; box-shadow: 0 2px 6px rgba(0,0,0,0.4); white-space: normal;
    }
    .tooltip:hover .tooltiptext { visibility: visible; opacity: 1; }
    .tooltip-title { font-weight: bold; margin-bottom: 0.2rem; }
    .suggestion-list { margin: 0.3rem 0 0 1rem; padding: 0; }
    .suggestion-list li { list-style: disc; margin-left: 1rem; }
  </style>
</head>
<body>
  <header>
    <h1>Report for ${path.basename(filePath)}</h1>
  </header>
  <div class="container">
    <pre>
`;

    // Process each line: add line numbers and insert error tooltips
    codeLines.forEach((lineContent, index) => {
      const lineNumber = index + 1;
      let modifiedLine = lineContent;
      if (errorMap[lineNumber]) {
        errorMap[lineNumber]
          .sort((a, b) => b.column - a.column)
          .forEach(error => {
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
      htmlContent += `<span class="line"><span class="line-number">${lineNumber.toString().padStart(3, " ")}</span> ${modifiedLine}</span>\n`;
    });

    htmlContent += `
    </pre>
  </div>
</body>
</html>
`;

    // Use provided reportPath or default to process.cwd() + "report.html"
    reportPath = reportPath || path.join(process.cwd(), "report.html");
    fs.writeFileSync(reportPath, htmlContent, "utf8");
    // console.log(`HTML report generated at: ${reportPath}`);

    // Debug: Verify if file exists
    if (fs.existsSync(reportPath)) {
      console.log("Report file exists.");
    } else {
      console.error("Report file does not exist after writing.");
    }
  } catch (err) {
    console.error("Error generating HTML report:", err);
  }
}

module.exports = { generateHTMLReport };
