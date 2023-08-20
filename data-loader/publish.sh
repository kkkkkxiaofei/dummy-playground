echo "upgrading versions..."
VERSION=$(npm version patch)
git add -am "publish with $VERSION"
echo "starting publishing with $VERSION"
npm publish