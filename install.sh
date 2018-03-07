#! /bin/bash

set -e

function command_exists {
    type "$1" &> /dev/null;
}


if command_exists node; then
    npm install
    node "app.js"
else
    echo "NodeJS required to run the game, please install and try again:"
    echo "https://nodejs.org/en/download/"
fi
