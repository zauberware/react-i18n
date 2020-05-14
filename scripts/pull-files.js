require("dotenv").config({
  path: `${process.env.npm_config_env}/.env`,
});
const { exec } = require("child_process");

process.chdir(process.env.npm_config_env);

const AT = process.env.REACT_APP_LOKALISE_TOKEN;
const PID = process.env.REACT_APP_LOKALISE_PROJECT_ID;
const FOLDER = process.env.REACT_APP_LOCALES_BUILD_PATH;
const LOCALES = JSON.parse(process.env.REACT_APP_LOCALES);
const FORMAT = "json";

// NOTE: format: json_structured
//         - pulls files in same format we parse files (key: {translation: message, limit: x})
//         - not sure there is a use case for downloading structured JSON from Lokalise
//         - public folder + s3 should use key:value format (json)
// NOTE: format: json
//         - pulls files in flat key:value format
//         - to be used for s3, build, development
const syncFiles = () => {
  return LOCALES.reduce((previousPromise) => {
    return previousPromise.then(() => {
      return new Promise((resolve) => {
        let cmd = `lokalise2 file download --format ${FORMAT} --token ${AT} --unzip-to ${FOLDER}`;

        if (process.env.npm_config_branch) {
          cmd = `${cmd} --project-id ${PID}:${process.env.npm_config_branch}`;
        } else {
          cmd = `${cmd} --project-id ${PID}`;
        }

        exec(cmd, (err, stdout, stderr) => {
          console.log(stdout);
          resolve();
        });
      });
    });
  }, Promise.resolve());
};

return syncFiles();
