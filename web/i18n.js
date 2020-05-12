import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import Backend from "i18next-chained-backend";
import xhrbackend from "i18next-xhr-backend";
const { join } = require("path");
let ENV = "/";

if (JSON.parse(process.env.REACT_APP_BRANCHES)) {
  ENV = `/${process.env.REACT_APP_ENV}/`;
}

const PROJECT_ID = process.env.REACT_APP_LOKALISE_PROJECT_ID;
const DEFAULT_LOCALE = process.env.REACT_APP_DEFAULT_LOCALE;
const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
const LOCALES = process.env.REACT_APP_LOCALES;

i18n
  .use(Backend)
  // connect with React
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    preload: [DEFAULT_LOCALE],
    load: "currentOnly",
    // NOTE: Keep Empty. Namespaces will be identified + downloaed automatically
    ns: [],
    backend: {
      backends: [xhrbackend, xhrbackend],
      backendOptions: [
        {
          loadPath: `https://s3.eu-central-1.amazonaws.com/${S3_BUCKET}/${PROJECT_ID}${ENV}{{lng}}/{{ns}}.json`,
          allowMultiLoading: false,
          parse: function (data) {
            return JSON.parse(data);
          },
          crossDomain: true,
          requestOptions: {
            mode: "cors",
            credentials: "same-origin",
            cache: "default",
          },

          // can be used to reload resources in a specific interval (useful in server environments)
          reloadInterval: false,
        },
        {
          loadPath: join(__dirname, "./locales/{{lng}}/{{ns}}.json"),

          parse: function (data) {
            return JSON.parse(data);
          },
        },
      ],
    },
    debug: true,
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    whitelist: LOCALES,
    // key: "" is not a valid key, use default fallback instead
    returnEmptyString: false,
    react: {
      useSuspense: true,
      //wait: true,
    },
    interpolation: {
      // not needed for react as it escapes by default
      escapeValue: false,
    },
  });

export default i18n;
export { useTranslation };
