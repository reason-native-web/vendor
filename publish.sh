set -e
packages=(
  ssl
  lwt_ssl
  h1
  h1-lwt
  h1-lwt-unix
  h2
  h2-lwt
  h2-lwt-unix
  piaf
)
extract() {
  # Field's key/value should be on their own line
  echo $(cat package.json \
    | grep "$1" \
    | head -1 \
    | awk -F: '{ print $2 }' \
    | sed 's/[",]//g')
}

for name in "${packages[@]}"
do
  cp $name.json package.json
  package_name=$(extract name)
  version=$(extract version)
  npm_version=$(npm view "$package_name" version 2> /dev/null || echo 0)
  if [ "$npm_version" != "$version" ]
  then
    esy
    npm publish --access public
  fi
  rm package.json
done
