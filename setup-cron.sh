#!/bin/bash

ENV="env"
ENV_NTLS_STAGING="ntls-staging"
ENV_NTLS_DEMO="ntls-demo"
ENV_PALAU_STAGING="palau-staging"
ENV_PALAU_DEMO="palau-demo"
ENV_BHUTAN_STAGING="bhutan-staging"
ENV_BHUTAN_DEMO="bhutan-demo"

# Path to the script
TS_SCRIPT_PATH_NTLS_STAGING="$HOME/nautilus-wallet-recurring-payment/recurring_payment_script_ntls_staging.ts"
JS_SCRIPT_PATH_NTLS_STAGING="$HOME/nautilus-wallet-recurring-payment/recurring_payment_script_ntls_staging.js"

TS_SCRIPT_PATH_NTLS_DEMO="$HOME/nautilus-wallet-recurring-payment/recurring_payment_script_ntls_demo.ts"
JS_SCRIPT_PATH_NTLS_DEMO="$HOME/nautilus-wallet-recurring-payment/recurring_payment_script_ntls_demo.js"

TS_SCRIPT_PATH_PALAU_STAGING="$HOME/nautilus-wallet-recurring-payment/recurring_payment_script_palau_staging.ts"
JS_SCRIPT_PATH_PALAU_STAGING="$HOME/nautilus-wallet-recurring-payment/recurring_payment_script_palau_staging.js"

TS_SCRIPT_PATH_PALAU_DEMO="$HOME/nautilus-wallet-recurring-payment/recurring_payment_script_palau_demo.ts"
JS_SCRIPT_PATH_PALAU_DEMO="$HOME/nautilus-wallet-recurring-payment/recurring_payment_script_palau_demo.js"

TS_SCRIPT_PATH_BHUTAN_STAGING="$HOME/nautilus-wallet-recurring-payment/recurring_payment_script_bhutan_staging.ts"
JS_SCRIPT_PATH_BHUTAN_STAGING="$HOME/nautilus-wallet-recurring-payment/recurring_payment_script_bhutan_staging.js"

TS_SCRIPT_PATH_BHUTAN_DEMO="$HOME/nautilus-wallet-recurring-payment/recurring_payment_script_bhutan_demo.ts"
JS_SCRIPT_PATH_BHUTAN_DEMO="$HOME/nautilus-wallet-recurring-payment/recurring_payment_script_bhutan_demo.js"

# Create the logs directory if it doesn't exist
mkdir -p logs
cd logs
mkdir -p $ENV_NTLS_STAGING
mkdir -p $ENV_NTLS_DEMO
mkdir -p $ENV_PALAU_STAGING
mkdir -p $ENV_PALAU_DEMO
mkdir -p $ENV_BHUTAN_STAGING
mkdir -p $ENV_BHUTAN_DEMO

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

# Install dependencies
npm install

# Transpile TypeScript to JavaScript
npx tsc "$TS_SCRIPT_PATH_NTLS_STAGING"
npx tsc "$TS_SCRIPT_PATH_NTLS_DEMO"
npx tsc "$TS_SCRIPT_PATH_PALAU_STAGING"
npx tsc "$TS_SCRIPT_PATH_PALAU_DEMO"
npx tsc "$TS_SCRIPT_PATH_BHUTAN_STAGING"
npx tsc "$TS_SCRIPT_PATH_BHUTAN_DEMO"

# Create a temporary file for the consolidated cron job
CRON_JOB_TEMP_FILE="/tmp/cronjob_temp"

# Add all cron jobs to the temporary file
echo "0 7 * * * node $JS_SCRIPT_PATH_NTLS_STAGING >> $HOME/nautilus-wallet-recurring-payment/logs/$ENV_NTLS_STAGING/logfile_\`date +\%F+\%H:\%M:\%S\`.log 2>&1" > "$CRON_JOB_TEMP_FILE"
echo "0 7 * * * node $JS_SCRIPT_PATH_NTLS_DEMO >> $HOME/nautilus-wallet-recurring-payment/logs/$ENV_NTLS_DEMO/logfile_\`date +\%F+\%H:\%M:\%S\`.log 2>&1" >> "$CRON_JOB_TEMP_FILE"
echo "0 7 * * * node $JS_SCRIPT_PATH_PALAU_STAGING >> $HOME/nautilus-wallet-recurring-payment/logs/$ENV_PALAU_STAGING/logfile_\`date +\%F+\%H:\%M:\%S\`.log 2>&1" >> "$CRON_JOB_TEMP_FILE"
echo "0 7 * * * node $JS_SCRIPT_PATH_PALAU_DEMO >> $HOME/nautilus-wallet-recurring-payment/logs/$ENV_PALAU_DEMO/logfile_\`date +\%F+\%H:\%M:\%S\`.log 2>&1" >> "$CRON_JOB_TEMP_FILE"
echo "0 7 * * * node $JS_SCRIPT_PATH_BHUTAN_STAGING >> $HOME/nautilus-wallet-recurring-payment/logs/$ENV_BHUTAN_STAGING/logfile_\`date +\%F+\%H:\%M:\%S\`.log 2>&1" >> "$CRON_JOB_TEMP_FILE"
echo "0 7 * * * node $JS_SCRIPT_PATH_BHUTAN_DEMO >> $HOME/nautilus-wallet-recurring-payment/logs/$ENV_BHUTAN_DEMO/logfile_\`date +\%F+\%H:\%M:\%S\`.log 2>&1" >> "$CRON_JOB_TEMP_FILE"

# Install the consolidated cron job
crontab "$CRON_JOB_TEMP_FILE"

# Remove the temporary file
rm "$CRON_JOB_TEMP_FILE"

echo "Cron job has been set up successfully."
