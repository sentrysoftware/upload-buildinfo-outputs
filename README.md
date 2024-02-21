# GitHub Javascript Action Upload Buildinfo Outputs

This action prints searches for `buildinfo` files in project, then upload artifacts declared as outputs in Github build artifacts.

## Inputs

### `search-path`

[Glob](https://en.wikipedia.org/wiki/Glob_(programming)) pattern to search for `buildinfo` files. By default `**/*.buildinfo`.

### `file-encoding`

Encoding used by the `buildinfo` files. Default to `utf-8`.

### `retention-days`

Duration after which artifact will expire in days. If unspecified, defaults to repository/org retention settings (the limit of this value).

### `compression-level`

The level of compression for Zlib to be applied to the artifact archive. Default to `6`.

- `0`: No compression
- `1`: Best speed
- `6`: Default compression (same as GNU Gzip)
- `9`: Best compression

### `overwrite`

Whether or not to replace an existing artifact with the same name. Default to `false`.

## Outputs

The action does not provides output.

## Example usage

```yaml
uses: sentrysoftware/upload-buildinfo-outputs@main
with:
  search-path: '**/*.buildinfo'
  file-encoding: 'utf-8'
  retention-days: 10
  compression-level: 6
  overwrite: false
```
