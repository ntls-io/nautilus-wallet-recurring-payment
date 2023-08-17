# Trusted Contract Oracle Node Functionality

This repository contains the follolwing functions in escrow_funcitons.ts:
* create unsigned transactions
* signTransactionAndSubmit

## Installation

To install the required dependencies, run the following command:

```shell
npm install
```

## Build
To transpile the TypeScript code to JavaScript, use the TypeScript compiler (tsc). Run the following command:

```shell
tsc escrow_functions.ts
```

This will generate the JavaScript file `recurring_payment_script.js`.

## Execution
To execute the recurring payment script, run the following command:

```shell
node escrow_functions.js
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

