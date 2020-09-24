## Requirements

Install Lokalise (https://github.com/lokalise/lokalise-cli-2-go)

## Install

```
npm i @zauberware/react-i18n --save
yarn add @zauberware/react-i18n
```

## Create Project

Create Project at https://lokalise.com.
Copy token and project id to your .env file. Go to personal profile to grap token and to project settings to grap project id.

## .env

Configure and put these env variables to your .env file.

Common

```
REACT_APP_LOKALISE_TOKEN=token
REACT_APP_LOKALISE_PROJECT_ID=projectid
REACT_APP_BRANCHES=false
REACT_APP_LOCALES=["de", "en", "fr"]
REACT_APP_DEFAULT_LOCALE=de
REACT_APP_ENV=development
REACT_APP_S3_BUCKET=zwt.locales.test/lokalise
REACT_APP_SRC_INPUT=./src/**/*.js
```

React

```
REACT_APP_LOCALES_BUILD_PATH=public/locales
REACT_APP_LOCALES_PUSH_PATH=./.locales
REACT_APP_ENV=development
```

React-Native

```
REACT_APP_LOCALES_BUILD_PATH=www/locales
REACT_APP_LOCALES_PUSH_PATH=.locales
```

## package.json scripts

Put these scripts into your root package.json

```
"locales-push": "npm explore @zauberware/react-i18n -- npm run locales-push --env=$PWD",
"locales-parse": "npm explore @zauberware/react-i18n -- npm run locales-parse --env=$PWD",
"locales-push-files": "npm explore @zauberware/react-i18n -- npm run locales-push-files --env=$PWD",
"locales-pull-files": "npm explore @zauberware/react-i18n -- npm run locales-pull-files --env=$PWD"
```

### Develop your app!

### React

```
import React, { Suspense } from "react";

<Suspense fallback="Loading">
    <App />
</Suspense>
```

```
import i18n, { useTranslation } from "@zauberware/react-i18n/web";
const { t } = useTranslation("app", { useSuspense: true });

{t('key')}
{t('key', {maxLength: 150})}
```

### React Native

```
import i18n, { useTranslation } from "@zauberware/react-i18n/mobile";
```

## Flows

### Create locales

Based on the env variable "REACT_APP_LOCALES", it will create the locales you want to use for your project. You can re-run this command if you want to add locales.

```
npm run locales-push
```

### Use branches [optional]

Go to project settings. Check "branching", save.
Create branches you need e.g. development, staging, production.
Set env variable "REACT_APP_BRANCHES" to true to tell React to download env specific translations.
Set "REACT_APP_ENV" to the env you are currently using.

All package.json commands need to add `--branch=staging` to tell Lokalise which env we are talking to.

### Parse translation keys

Will create parsed files to upload/compare with Lokalise.
You can configure where the parser should create the files with "REACT_APP_LOCALES_PUSH_PATH".
These files be used to push/cleanup keys.
The format of these JSON files is structured. Parser will collect keys, validation limits etc.

```
npm run locales-parse
```

### Push translation keys

Push translations keys/files from "REACT_APP_LOCALES_PUSH_PATH".

```
npm run locales-push-files
```

Go to your lokalise project and check whether the upload was successful.

### Pull translation keys

Pull keys to directory. Please use **public/locales** for React web projects!
You have to pull locales, otherwise fallback files won't work!
These files will be put into the build as fallback JSON files.
The format of these JSON files is flat (key: value).

```
npm run locales-pull-files
```

### S3 Bucket sync

Enable S3 Integration in your lokalise project.

Specify which bucket should be used declared with "REACT_APP_S3_BUCKET". Bucket needs to be public!

You can trigger s3 sync by clicking "Download" and selecting "Amazon S3" as export.

Please use project_id/%LANG_ISO% as file structure.
Please use project_id/env/%LANG_ISO% when using branches.
Please use format "JSON (.json)"!
Click "build only" to trigger s3.

You can ask support to enable s3 sync on other events like "translations updated".

### Translator Role

Create Translator User + Translator Role, which limitted permissions. Can only edit locales. Cannot create locales or create keys. Invite client to start translating.

### Cleanup keys

Generate keys `npm run locales-parse`.

`npm run locales-push-files --cleanup=true` will remove all remote keys which do not exist anymore
