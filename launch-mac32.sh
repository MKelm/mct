#!/bin/sh
ABSPATH=$(cd "$(dirname "$0")"; pwd)
$ABSPATH/bin/mac32/node-webkit.app/Contents/MacOS/node-webkit $ABSPATH/
