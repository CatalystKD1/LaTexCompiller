function readBalancedBraces(str, startIndex) {
    let depth = 0;
    let i = startIndex;

    // if does not start with { then it is an error
    if (str[i] !== '{'){
        throw new Error("Expected '{'");
    }

    depth++; // the first {

    // inner string
    let contnetStart = i + 1;
    i++;

    // inner string loop
    while(i < str.length) {
        // any iner {} increase depth
        if (str[i] === '{') depth++;
        // if we see an end bracket then we decrease depth
        else if (str[i] === '}') depth--;

        if (depth === 0) {
            return {
                content: str.slice(contnetStart, i),
                endIndex: i
            };
        }
        i++;
    }
    throw new Error("Unclosed race");
}

export function parseNewCommands(latex) {
    const results = [];
    let i = 0;

    while(i < latex.length) {
        // identify LaTex variables
        if (latex.startsWith("\\newcommand", i)) {
            i += "\\newcommand".length;

            // skip whitespaces
            while (latex[i] === ' ' || latex[i] === '\n') i++;

            // parse {\\name}
            const nameBlock = readBalancedBraces(latex, i);
            const rawName = nameBlock.content.trim();

            const name = rawName.replace(/^\\/, ""); // remove the leading slash
            i = nameBlock.endIndex + 1;

            // check for optional [n]
            let argCount = 0;
            if (latex[i] === '[') {
                i++
                let num = "";
                
                while (latex[i] !== ']') {
                    num += latex[i];
                    i++;
                }
                argCount = parseInt(num, 10);
                i++;
            }

            // skip whitespace in case the last condition is passed
            while (latex[i] === ' ' || latex[i] === '\n') ++i;

            // Parse value {...}
            const valueBlock = readBalancedBraces(latex, i);
            const value = valueBlock.content;

            i = valueBlock.endIndex + 1;

            results.push({
                name,
                value,
                argCount
            });
        } else {
            i++;
        }
    }

    return results;
}

// ---------- Replace Variables ----------
export function replaceNewCommands(latex, variables) {
    let result = latex;
    variables.forEach(v => {
        const pattern = new RegExp( 
            `\\\\newcommand\\{\\\\${v.name}\\}(\\[\\d+\\])?\\{`,
            "g"
        );

        result = result.replace(pattern, match => {
            return match.replace(/\{$/, `{${v.value}}`);
        });
    });

    return result;
}

export function applyVariablesToLatex(latex, variables) {
  let i = 0;
  let result = "";

  while (i < latex.length) {
    if (latex.startsWith("\\newcommand", i)) {
      let start = i;

      i += "\\newcommand".length;

      // Skip whitespace
      while (latex[i] === ' ' || latex[i] === '\n') i++;

      // Read name block
      const nameBlock = readBalancedBraces(latex, i);
      const rawName = nameBlock.content.trim();
      const name = rawName.replace(/^\\/, "");

      i = nameBlock.endIndex + 1;

      // Optional [n]
      let argPart = "";
      if (latex[i] === '[') {
        let startArg = i;
        while (latex[i] !== ']') i++;
        i++; // include ]
        argPart = latex.slice(startArg, i);
      }

      // Skip whitespace
      while (latex[i] === ' ' || latex[i] === '\n') i++;

      // Read value block
      const valueBlock = readBalancedBraces(latex, i);

      i = valueBlock.endIndex + 1;

      // 🔍 Find replacement value
      const found = variables.find(v => v.name === name);

      const newValue = found ? found.value : valueBlock.content;

      // ✅ Rebuild command
      result += `\\newcommand{\\${name}}${argPart}{${newValue}}`;

    } else {
      result += latex[i];
      i++;
    }
  }

  return result;
}

// ---------- Test Case ----------

const latex = `
\\newcommand{\\name}{John Doe}
\\newcommand{\\title}{My {Cool} Title}
\\newcommand{\\greet}[1]{Hello #1}
`;

console.log(parseNewCommands(latex));