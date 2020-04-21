const Cp = require("child_process");
const Fs = require("fs");
const Path = require("path");
Cp.execSync("git fetch --tags", { cwd: "./openssl" });
const tags = Cp.execSync("git tag", { cwd: "./openssl" });
const latestTag = tags
  .toString()
  .split("\n")
  .reduce((latest, t) => (t.startsWith("OpenSSL_1_1_1") ? t : latest));

console.log({ latestTag });

const packagePath = Path.resolve("esy-openssl.json");
const opensslPackageJson = JSON.parse(Fs.readFileSync(packagePath).toString());

if (opensslPackageJson.opensslTag === latestTag) {
  console.log("Already up to date");
  return;
} else {
  console.log(`Checking out tags/${latestTag}`);
  Cp.execSync(`git checkout tags/${latestTag}`, { cwd: "./openssl" });
  console.log("Updating package.json");
  const version = opensslPackageJson.version;
  const [major, minor, patch] = version.split(".");
  const patchedPackageJson = {
    ...opensslPackageJson,
    opensslTag: latestTag,
    version: `${major}.${minor}.${parseInt(patch, 10) + 1}`,
  };

  Fs.writeFileSync(
    packagePath,
    JSON.stringify(patchedPackageJson, null, 2) + "\n"
  );
}
