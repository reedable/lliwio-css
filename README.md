# lliwio-css

Shared CSS for Reedable applications.

## Consuming the package

Each GitHub Release includes an npm package tarball. Consumers pin the exact release asset URL in `package.json`:

```json
{
  "dependencies": {
    "@reedable/lliwio-css": "https://github.com/reedable/lliwio-css/releases/download/v0.1.0/reedable-lliwio-css-0.1.0.tgz"
  }
}
```

Vite consumers can inline the stylesheet:

```ts
import readerCss from "@reedable/lliwio-css/index.css?inline";
```

## Version lifecycle

`package.json` is the single version authority. A version moves through these
states:

| State             | Example      | Meaning                                      |
| ----------------- | ------------ | -------------------------------------------- |
| Development       | `0.2.0-dev`  | Work toward the next release; never tag this |
| Release candidate | `0.2.0-rc.1` | Testable prerelease; may be tagged           |
| Final             | `0.2.0`      | Production release; may be tagged            |

After a final release, start the next development version with one of:

```sh
npm run version:patch
npm run version:minor
npm run version:major
```

These commands produce a `-dev` version. When the intended changes are ready,
use `npm run version:rc` to replace `-dev` with `-rc.1`. Running it again on an
RC increments the number. Use `npm run version:release` to remove either
`-dev` or `-rc.N` and produce the final version.

Version commands require a clean working tree and only edit `package.json`.
Review and commit the resulting version change yourself; the scripts never
commit or push.

## Tagging a release

After committing an RC or final version, run:

```sh
npm run release:tag
```

This command requires a clean working tree, rejects `-dev` and unsupported
version stems, rejects an existing tag, and creates a local annotated tag. It
prints the exact push command but does not run it. This explicit commit boundary
ensures the tag identifies already-reviewed content.

For the initial `0.1.0` release, commit all intended files first, run
`npm run release:tag`, and then run the printed push command.

## GitHub release

Pushing a valid `v<version>` tag starts the Release workflow. It checks that
the tag matches `package.json`, builds the `.tgz`, and creates a draft GitHub
Release. An `-rc.N` tag creates a prerelease; a final tag creates a regular
release. Inspect the draft and its package asset before publishing it.

The workflow rejects malformed, `-dev`, zero-numbered RC, and mismatched tags.
It packages only files admitted by the `files` field.
