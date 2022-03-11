# How to contribute

Contributions are welcome. New ideas, improvements and optimizations are collected via [`GitHub Discussions`](https://github.com/ivanhofer/typesafe-i18n/discussions). Feel free to take a look at the open topics or start a new discussion if you want.

This project should keep following values:

 - lightweight and performat i18n solution
 - best possible TypeScript support
 - easy to use (DX)
 - should work well together with other tools and services

## package manager

This project uses [`pnpm`](https://pnpm.io/de/) as a package manager. You can install it by running `npm install -g pnpm`. It uses the same syntax like `npm` for most commands, you only have to write `pnpm` instead of `npm`. e.g. `pnpm install` or `pnpm test`

## testing

Tests are written using the [`uvu`](https://github.com/lukeed/uvu) test runner. If you make changes, please check if all tests are still passing by running `pnpm test`.

To ensure the output-size of the core-library stays small, [`size-limit`](https://github.com/ai/size-limit) is used. By running `pnpm build` and then `pnpm test:size` a report gets generated to see if changes had negative impact to the bundle size of the translation runtime.

## submitting changes

If you make changes, please open a new [`PR`](https://github.com/ivanhofer/typesafe-i18n/pulls) and fill out the template. Pull requests are run trough a GitHub Action that makes sure the source code is formatted and that all tests are passing.

## coding conventions

This project uses [`prettier`](https://prettier.io/) and [`eslint`](https://eslint.org/) to ensure the code looks always the same.
Please run `pnpm lint` to check for warnings and errors. You can also run `pnpm lint:fix` to automatically fix most of the violations.
