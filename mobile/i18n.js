import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import Backend from "i18next-chained-backend";
import xhrbackend from "i18next-xhr-backend";
import {
  REACT_APP_BRANCHES,
  REACT_APP_ENV,
  REACT_APP_LOKALISE_PROJECT_ID,
  REACT_APP_DEFAULT_LOCALE,
  REACT_APP_LOCALES,
  REACT_APP_PUBLIC_LOCALES_OUTPUT,
  REACT_APP_S3_BUCKET,
} from "react-native-dotenv";

let ENV = JSON.parse(REACT_APP_BRANCHES) ? `/${REACT_APP_ENV}` : "/";

const PROJECT_ID = REACT_APP_LOKALISE_PROJECT_ID;
const S3_BUCKET = REACT_APP_S3_BUCKET;
const DEFAULT_LOCALE = REACT_APP_DEFAULT_LOCALE;
const LOCALES = REACT_APP_LOCALES;
let FALLBACKTRANSLATIONS = {};

try {
  const pth = `../../../../${REACT_APP_PUBLIC_LOCALES_OUTPUT}`;
  FALLBACKTRANSLATIONS = require(pth);
  // console.debug('~~~ FALLBACK TRANSLATIONS ~~~');
  // console.debug(FALLBACKTRANSLATIONS);
} catch (err) {
  console.log("Cannot load fallback translation files!");
  console.log(err);
}

i18n
  .use(Backend)
  // connect with React
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    preload: [DEFAULT_LOCALE],
    load: "currentOnly",
    ns: [],
    defaultNS: "app",
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
          parse: function (info, path) {
            const pathArray = path.split("/");
            const language = pathArray[2];
            const ns = pathArray[3].replace(".json", "");
            const parsed = FALLBACKTRANSLATIONS[language][ns].default;
            return parsed;
          },
        },
      ],
    },
    debug: true,
    lng: DEFAULT_LOCALE,
    fallbackLng: DEFAULT_LOCALE,
    whitelist: LOCALES,
    returnEmptyString: false,
    react: {
      useSuspense: true,
    },
    interpolation: {
      // not needed for react as it escapes by default
      escapeValue: false,
    },
  });

export default i18n;
export { useTranslation };
