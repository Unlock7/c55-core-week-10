// API documentation: https://www.thecocktaildb.com/api.php

import path from "path";
import fs from "fs/promises";

const BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

// Add helper functions as needed here

export async function main() {
  if (process.argv.length < 3) {
    console.error("Please provide a cocktail name as a command line argument.");
    return;
  }

  const cocktailName = process.argv[2];
  const url = `${BASE_URL}/search.php?s=${cocktailName}`;

  const __dirname = import.meta.dirname;
  const outPath = path.join(__dirname, `./output/${cocktailName}.md`);

  try {
    // 1. Fetch data from the API at the given URL
    // 2. Generate markdown content to match the examples
    // 3. Write the generated content to a markdown file as given by outPath

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.error || res.statusText);

      error.status = res.status;

      throw error;
    }

    if (!data.drinks) {
      console.error("No cocktails found with that name.");
      return;
    }

    let markdown = "# Cocktail Recipes\n\n";

    for (const drink of data.drinks) {
      markdown += `## ${drink.strDrink}\n\n`;
      markdown += `![${drink.strDrink}](${drink.strDrinkThumb}/medium)\n\n`;
      markdown += `**Category**: ${drink.strCategory}\n`;

      const isAlcoholic = drink.strAlcoholic === "Alcoholic" ? "Yes" : "No";
      markdown += `**Alcoholic**: ${isAlcoholic}\n\n`;

      markdown += `### Ingredients\n\n`;
      for (let i = 1; i <= 15; i++) {
        const ingredient = drink[`strIngredient${i}`];
        const measure = drink[`strMeasure${i}`];
        if (ingredient) {
          const amount = measure ? `${measure.trim()} ` : "";
          markdown += `- ${amount}${ingredient.trim()}\n`;
        }
      }

      markdown += `\n### Instructions\n\n`;
      markdown += `${drink.strInstructions}\n\n`;
      markdown += `Serve in: ${drink.strGlass}\n\n`;
    }

    const outputDir = path.dirname(outPath);
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outPath, markdown.trim() + "\n");
  } catch (error) {
    console.error("Error occured:", error.message);

    // 4. Handle errors
  }
}

// Do not change the code below
if (!process.env.VITEST) {
  main();
}
