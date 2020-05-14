require("dotenv").config({
  path: `${process.env.npm_config_env}/.env`,
});
const { exec } = require("child_process");

process.chdir(process.env.npm_config_env);

const AT = process.env.REACT_APP_LOKALISE_TOKEN;
const PID = process.env.REACT_APP_LOKALISE_PROJECT_ID;
const FOLDER = process.env.REACT_APP_LOCALES_PUSH_PATH;
const LOCALES = JSON.parse(process.env.REACT_APP_LOCALES);

const createFiles = () => {
  return LOCALES.reduce((previousPromise, locale) => {
    return previousPromise.then(() => {
      return new Promise((resolve) => {
        let cmd = `lokalise2 file upload --token ${AT} --distinguish-by-file --file "${FOLDER}/${locale}/*.json" --lang-iso ${locale}`;

        // NOTE: be careful using this. it will remove all keys at lokalise which are not in your locale files localed in parsed locales folder
        if (process.env.npm_config_cleanup) {
          cmd = `${cmd} --cleanup-mode`;
        }

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

return createFiles();
