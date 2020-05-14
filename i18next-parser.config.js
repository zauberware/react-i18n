require("dotenv").config({
  path: `${process.env.npm_config_env}/.env`,
});

const LOCALES = JSON.parse(process.env.REACT_APP_LOCALES);
const LOCALES_OUTPUT = process.env.REACT_APP_LOCALES_PUSH_PATH;
const REACT_APP_SRC_INPUT = process.env.REACT_APP_SRC_INPUT;

process.chdir(process.env.npm_config_env);

module.exports = {
  // creates _old.json files. not sure why it's useful. if you enable this, we have to change the push-files script to ignore _old files.
  createOldCatalogs: false,
  namespaceSeparator: ":",
  keySeparator: ".",
  defaultValue: "",
  indentation: 2,
  lexers: {
    js: ["JavascriptLexer"],
    default: ["JavascriptLexer"],
  },
  lineEnding: "auto",
  locales: LOCALES,
  output: `${LOCALES_OUTPUT}/$LOCALE/$NAMESPACE.json`,
  input: [REACT_APP_SRC_INPUT],
  reactNamespace: false,
  useKeysAsDefaultValue: false,
  verbose: true,
  keepRemoved: false,
  skipDefaultValues: true,
  customValueTemplate: {
    // eslint-disable-next-line no-template-curly-in-string
    translation: "${defaultValue}",
    // eslint-disable-next-line no-template-curly-in-string
    limit: "${maxLength}",
  },
  // Keep keys from the catalog that are no longer in code
};
