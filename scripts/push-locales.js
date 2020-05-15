require('dotenv').config({
    path: `${process.env.npm_config_env}/.env`,
});

const { exec } = require('child_process');

const AT = process.env.REACT_APP_LOKALISE_TOKEN;
const PID = process.env.REACT_APP_LOKALISE_PROJECT_ID;
const LOCALES = JSON.parse(process.env.REACT_APP_LOCALES);

const createLocales = () => {
    return LOCALES.reduce((previousPromise, locale) => {
        return previousPromise.then(() => {
            return new Promise((resolve) => {
                let cmd = `lokalise2 language create --token ${AT} --project-id ${PID} --lang-iso ${locale}`;

                if (process.env.npm_config_branch) {
                    cmd = `${cmd} --branch ${process.env.npm_config_branch}`;
                }

                exec(cmd, (err, stdout, stderr) => {
                    const languages = JSON.parse(stdout).languages;

                    if (!languages.length) {
                        console.log(`"${locale}" already exists`);
                    } else {
                        console.log(`"${locale}" created`);
                    }

                    resolve();
                });
            });
        });
    }, Promise.resolve());
};

createLocales();
