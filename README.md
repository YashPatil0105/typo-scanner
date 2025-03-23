# typo-scanner

A tool to detect and report typographical errors in your JavaScript code. It uses AST parsing along with spell-checking to identify potential typos in variable names, function names, comments, and more.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Command-Line Interface](#command-line-interface)
  - [API Usage](#api-usage)
- [Configuration](#configuration)
- [Example](#example)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **AST-Based Analysis:** Leverages Babel to parse your JavaScript files and extract identifiers.
- **Spell-Checking Integration:** Checks words against a dictionary and suggests corrections.
- **Duplicate Aggregation:** Aggregates duplicate typo occurrences along with occurrence counts.
- **Customizable Whitelist:** Easily configure a list of words (e.g., common JavaScript methods) to ignore.
- **HTML Report Generation:** (Optional) Generates a dark-themed HTML report with inline code highlights and tooltips.

## Installation

Install the package via npm:

```bash
npm install typo-scanner
```

Or use it with npx:

```bash
npx typo-scanner <file-to-analyze.js>
```

## Usage

### Command-Line Interface

After installation, you can run the tool from the command line. For example:

```bash
typo-scanner sample.js
```

This command will analyze `sample.js` for typos and output the results in the console. If configured, it will also generate an HTML report in your project directory.

### API Usage

You can also import and use `typo-scanner` programmatically in your Node.js projects:

```js
const { analyzeFile } = require('typo-scanner');

const filePath = 'path/to/your/file.js';
const results = analyzeFile(filePath);

console.log(results);
```

Each element in the returned array has the following structure:

- `word`: The detected misspelled word.
- `count`: The number of occurrences.
- `suggestions`: An array of suggested corrections.
- `occurrences`: An array of objects with:
  - `line`: Line number of the typo.
  - `column`: Column number where the typo starts.
  - `snippet`: The line of code containing the typo.

## Configuration

You can customize the behavior of `typo-scanner` by providing a configuration file (e.g., `typoscanner.config.json`) in your project root. This file may include:

- **Whitelist:** Array of words that should not be flagged (e.g., `["forEach", "map", "filter", ...]`).
- **Custom Dictionaries:** Define additional words that are valid for your project.

Example configuration:

```json
{
  "whitelist": [
    "forEach",
    "map",
    "filter",
    "reduce",
    "setTimeout",
    "clearTimeout",
    "console"
  ],
  "customDictionary": [
    "myCustomFunction",
    "myVariable"
  ]
}
```

## Example

Consider a JavaScript file `sample.js` with the following content:

```js
// This is a sampple JavaScript file with intentional typoes
function calcluateSum(a, b) {
  return a + b;
}

const numbrs = [1, 2, 3, 4];
let totl = 0;

numbrs.forEach(numbr => {
  totl += numbr;
});

console.log("The total is:", totl);
```

Running the command-line tool:

```bash
typo-scanner sample.js
```

might output:

```json
[
  {
    "word": "calcluateSum",
    "count": 1,
    "suggestions": ["calculateSum"],
    "occurrences": [
      {
        "line": 2,
        "column": 10,
        "snippet": "function calcluateSum(a, b) {"
      }
    ]
  },
  {
    "word": "numbrs",
    "count": 2,
    "suggestions": ["numbers"],
    "occurrences": [
      { "line": 4, "column": 7, "snippet": "const numbrs = [1, 2, 3, 4];" },
      { "line": 6, "column": 0, "snippet": "numbrs.forEach(numbr => {" }
    ]
  }
]
```

And if HTML reporting is enabled, it will generate a visually rich `report.html` file.

## Testing

To run tests locally:

```bash
npm test
```

Make sure you have written tests (using Mocha, Jest, or another testing framework) to verify that your analyzer works as expected on a variety of sample inputs.

## Contributing

Contributions are welcome! If you find a bug, have a feature request, or want to submit a pull request, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Write tests to cover your changes.
4. Submit a pull request with a clear description of your changes.

Please refer to our [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions, suggestions, or feedback, please open an issue on GitHub or contact [yashpatil0107@gmail.com](mailto:yashpatil0107@gmail.com).

---
