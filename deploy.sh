#!/bin/bash
rm -rf ./dist
yarn build
serve dist -l 3124