#!/bin/sh

echo "Checking for focused tests..."
STATUS=0

MATCHES=$(git --no-pager diff --staged -G'[fit|fdescribe]\(' -U0 --word-diff | grep -E '\-\]\{\+(fit|fdescribe)' | wc -l)
if [ $MATCHES -gt 0 ]
then
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    echo "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    echo "iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii"
    echo "...You forgot to remove 'fdescribe' or 'fit'"
    STATUS=1
fi

exit $STATUS
