### Before submitting the PR, please make sure you do the following
- [ ] It's really useful if your PR references an issue where it is discussed ahead of time.
- [ ] Prefix your PR title with `[feat]`, `[fix]`, `[chore]`, or `[docs]`.
- [ ] This message body should clearly illustrate what problems it solves.
- [ ] Ideally, include a test that fails without this PR but passes with it.

### Tests
- [ ] Run the tests with `pnpm test` and lint the project with `pnpm lint`

## generator

If you change something in the `generator`, please also:
 - add some snapshot tests to the `packages/generator/test/generator.test.ts`-file
 - then run `pnpm test` => you should see your tests failing
 - run `pnpm test:update-generated-files`
 - again run `pnpm test` => your tests should pass
 - then add all the created `*.expected.*`-files to the git-index and
 - make sure these files look like you would expect them
 - finally commit these files to the repository