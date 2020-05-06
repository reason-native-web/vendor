# Vendor

This repo is used for publishing packages to npm that are either unreleased or depend on unreleased packages. This removes the need for resolutions in users' package.json.

## Add a package

> This example uses `websocketaf`

Add the git submodule, it is important that you use the `https` version because of the github workflow:

`git submodule add https://github.com/anmonteiro/websocketaf.git`

Create a `websocketaf.json` and whatever else is needed, in websocketaf's case we also need `websocketaf-lwt.json` and `websocketaf-lwt-unix.json`.

> Note: I usually just copy another package that is similar, in this case h1.json

Check the coresponding `.opam` file, eg. `websocketaf.opam`, `websocketaf-lwt.opam` and `websocketaf-lwt-unix.opam`for dependencies and add them to the json files accordingly.

Add build instructions under `esy`:

```json
"esy": {
    "build": "dune build --only-packages=websocketaf --profile=release -j 4 --root=./websocketaf",
    "install": "esy-installer #{self.target_dir / 'default' / 'websocketaf.install'}"
}
```

Add a `files` key that points to the folder where it's cloned, in this case : `"files": ["websocketaf"],`

Update `publish.yml` with the added libraries in the topological order. The order is important if a library depends on another library since they will be published in order to be able to build the next.
