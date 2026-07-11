#!/usr/bin/env bash
# Зелёный, если нет src/broken.txt
[[ -e src/broken.txt ]] && { echo "BUILD FAILED (broken.txt present)"; exit 1; }
echo "BUILD SUCCESSFUL (fake)"; exit 0
