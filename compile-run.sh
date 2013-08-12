#!/bin/bash
ABSPATH=$(cd "$(dirname "$0")"; pwd)
cd $ABSPATH
$ABSPATH/compile.sh
$ABSPATH/bin/linux64/nw $ABSPATH/ --url=file://$ABSPATH/lib/mctc.html