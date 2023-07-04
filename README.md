# Nautilus Wallet Recurring Payment

This repository contains the implementation of the Nautilus Wallet recurring payment script.

## Installation

To install the required dependencies, run the following command:

```shell
npm install
```

## Build
To transpile the TypeScript code to JavaScript, use the TypeScript compiler (tsc). Run the following command:

```shell
tsc recurring_payment_script.ts
```

This will generate the JavaScript file `recurring_payment_script.js`.

## Execution
To execute the recurring payment script, run the following command:

```shell
node recurring_payment_script.js
```

## Lint and Format
Run the ESLint command with the --fix flag followed by the file or directory you want to lint and fix.

```shell
npx eslint --fix *.ts
```

Run this command to run prettier.
```shell
npm run format
````