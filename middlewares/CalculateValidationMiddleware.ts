import { body } from "express-validator";


export const validateCalculation = [
  body("expression")
    .trim()
    .notEmpty().withMessage("Expression is required")
    .isString().withMessage("Expression must be a string")
    .custom((value) => {
      const baseAllowedChars = /^[0-9+\-*/().\s!^]+$/;

      const allowedFunctions = /(sin|cos|tan|log|sqrt|pi)/g;

      const degreeNotation = /\d+\s*deg/g;

      const funcMatches = [...value.matchAll(allowedFunctions)];
      const degMatches = [...value.matchAll(degreeNotation)];

      const protectedPositions = new Set();
      
      for (const match of [...funcMatches, ...degMatches]) {
        for (let i = match.index; i < match.index + match[0].length; i++) {
          protectedPositions.add(i);
        }
      }

      let invalidChars: any[] = [];
      for (let i = 0; i < value.length; i++) {
        if (protectedPositions.has(i)) continue;

        const char = value[i];
        if (!baseAllowedChars.test(char)) {
          invalidChars.push(char);
        }
      }

      if (invalidChars.length > 0) {
        throw new Error(`Invalid characters in expression: ${invalidChars.join(", ")}`);
      }

      let balance = 0;
      for (const char of value) {
        if (char === "(") balance++;
        if (char === ")") balance--;
        if (balance < 0) break; // Early exit if closing parenthesis appears before opening
      }

      if (balance !== 0) {
        throw new Error("Unbalanced parentheses in expression");
      }

      return true;
    }),
];