# Set app version based on HEROKU_SLUG_COMMIT
#if [ -n "$HEROKU_SLUG_COMMIT" ]; then
#  DD_VERSION=$HEROKU_SLUG_COMMIT
#fi

#!/usr/bin/env bash

# Set app version based on HEROKU_SLUG_COMMIT
DD_VERSION="Default"
if [ -n "$HEROKU_SLUG_COMMIT" ]; then
    DD_VERSION=$HEROKU_SLUG_COMMIT
fi