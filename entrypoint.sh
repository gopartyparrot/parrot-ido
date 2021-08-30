#!/bin/sh

echo '--- run yarn install'
yarn install

echo '--- run yarn build'
yarn build

echo '--- run yarn start'
yarn start
