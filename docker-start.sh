#!/bin/bash

echo "\n\n\nNpm install:"
yarn install

echo "\n\n\nRun migration:"
adonis migration:run --force

echo "\n\n\nRun seed:"
adonis seed

echo "\n\n\nStart node server:"
adonis serve --dev --polling
