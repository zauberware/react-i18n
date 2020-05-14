const fs = require("fs");
const util = require("util");
const readdir = util.promisify(fs.readdir);
const writeFile = util.promisify(fs.writeFile);

require("dotenv").config({
  path: `${process.env.npm_config_env}/.env`,
});

process.chdir(process.env.npm_config_env);
const OUTPUT_FOLDER = process.env.REACT_APP_LOCALES_BUILD_PATH;
const DEFAULT_LOCALE = process.env.REACT_APP_DEFAULT_LOCALE;
const LOCALES = JSON.parse(process.env.REACT_APP_LOCALES);

const loadNamespaces = async () => {
  try {
    // NOTE: Load one locale to detect namespaces.
    const files = await readdir(`${OUTPUT_FOLDER}/${DEFAULT_LOCALE}`);

    const namespaces = files
      .filter((file) => {
        if (!file.match(/_old/)) {
          return true;
        }

        return false;
      })
      .map((file) => {
        return file.match(/(\w+)\.json/)[1];
      });

    console.log(`Namespaces: ${namespaces} found.`);

    let indexFiles = "";
    LOCALES.forEach((locale) => {
      let cc = "";

      namespaces.forEach((namespace) => {
        indexFiles += `import * as ${locale}_${namespace} from './${locale}/${namespace}.json';\n`;
        cc += `${namespace}: ${locale}_${namespace}, `;
      });

      indexFiles += `export const ${locale} = {${cc}...{}};\n\n`;
    });

    await writeFile(`${OUTPUT_FOLDER}/index.js`, indexFiles);
  } catch (err) {
    console.log(`Error happened in post parse script: ${err.message}.`);

    console.log(
      `Please check if the parser was able to create translation files in target directory ${OUTPUT_FOLDER}`
    );

    process.exit(-1);
  }
};

loadNamespaces();
