#!/bin/bash
REPO="jsherrcode/api-arche"
TOKEN=$(curl -s -H "Content-Type: application/json" \
  -X POST \
  -d "{\"username\": \"$DOCKER_USERNAME\", \"password\": \"$DOCKER_PASSWORD\"}" \
  https://hub.docker.com/v2/users/login/ | jq -r .token)

TAGS=$(curl -s -H "Authorization: JWT $TOKEN" \
  "https://hub.docker.com/v2/repositories/$REPO/tags?page_size=100" \
  | jq -r '.results[].name' | grep '^v1\.' | sort -rV)

echo "Tags encontrados:"
echo "$TAGS"

COUNT=0
for TAG in $TAGS; do
  COUNT=$((COUNT+1))
  if [ $COUNT -gt 5 ]; then
    echo "Eliminando: $TAG"
    curl -s -X DELETE \
      -H "Authorization: JWT $TOKEN" \
      "https://hub.docker.com/v2/repositories/$REPO/tags/$TAG/"
  else
    echo "Conservando: $TAG"
  fi
done