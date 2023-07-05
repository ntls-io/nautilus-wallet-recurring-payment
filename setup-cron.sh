#!/bin/bash

ENV="ntls-demo"

# Path to the script
TS_SCRIPT_PATH="$HOME/nautilus-wallet-recurring-payment/recurring_payment_script.ts"
JS_SCRIPT_PATH="$HOME/nautilus-wallet-recurring-payment/recurring_payment_script.js"

# Create the logs directory if it doesn't exist
mkdir -p logs
cd logs
mkdir -p $ENV

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - &&\
sudo apt-get install -y nodejs

# Install dependencies
npm install

# Transpile TypeScript to JavaScript
npx tsc "$TS_SCRIPT_PATH"

# Add the cron job with the generated log file name
CRON_JOB="0 7 * * * node $JS_SCRIPT_PATH >> $HOME/nautilus-wallet-recurring-payment/logs/$ENV/logfile_\`date +\%F+\%H:\%M:\%S\`.log 2>&1"

# Write the cron job to a temporary file
echo "$CRON_JOB" > /tmp/cronjob

# Install the cron job
crontab /tmp/cronjob

# Remove the temporary file
rm /tmp/cronjob

echo "Cron job has been set up successfully."

