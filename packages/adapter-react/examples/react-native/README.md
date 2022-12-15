# `typesafe-i18n` bare react-native example

**This example shows how you could use `typesafe-i18n` in an bare react-native application.**

_There are many ways you could integrate the library and its i18n process into your applications. As  probably all applications and workflows are different, the solution shown here might not fit your needs. Luckily `typesafe-i18n` is really flexible and you can tweak it accordingly. You can ask specific questions by joining the [`Discord` server](https://discord.gg/T27AHfaADK)_

> This repository was set up using `npx react-native init AwesomeTSProject --template react-native-template-typescript`


## Run sample

Install dependencies
```bash
yarn
```

Run iOS:
`yarn ios`

Run Android:
`yarn android`

## Steps to integate in your project

1. Install polyfills for mobile
```bash
yarn add @formatjs/intl-getcanonicallocales @formatjs/intl-locale @formatjs/intl-pluralrules
```

2. Copy-paste [polyfill](src/polyfill) folder in your project

3. Do `import './polyfill'` in entry point

4. Patch [metro.config.js](metro.config.js) to allow `.cjs` extension