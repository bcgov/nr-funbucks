#!/bin/bash

connection=$(podman machine --log-level=debug ssh -- exit 2>&1 | grep Executing | sed -E 's/.*ssh \[(.*)\].*/\1/')
sshHost=$(echo "$connection" | sed -E 's/.* (.+@localhost) .*/\1/')
sshPort=$(echo "$connection" | sed -E 's/.*-p ([0-9]+) .*/\1/')
sshIdent=$(echo "$connection" | sed -E 's/.*-i ([^[:space:]]+) .*/\1/')
echo "sshHost  = $sshHost"
echo "sshPort  = $sshPort"
echo "sshIdent = $sshIdent"

podman machine ssh rm -r /tmp/workspace
podman machine ssh mkdir -p /tmp/workspace
podman machine ssh chmod -R 777 /tmp/workspace


# Run in foreground, passing vars
#
podman play \
  kube \
  lb.yml