#!/bin/bash

yarn build && \
yarn copy-assets && \
yarn copyfiles -u 1 static/**/* dist && \
yarn serve