# User guide

## Getting started

If you just want to have an idea of what `sonarwhal` does and you
have an updated version of `npm` (v5.2.0) and [Node LTS (v8.9.2)
or later][nodejs] you can use the following command:

```bash
npx sonarwhal https://example.com
```

Alternatively, you can install it locally with:

```bash
npm install -g --engine-strict sonarwhal
```

You can also install it as a `devDependency` if you prefer not to
have it globally.

The next thing that `sonarwhal` needs is a `.sonarwhalrc` file. The
fastest and easiest way to create one is by using the flag `--init`:

```bash
sonarwhal --init
```

This command will start a wizard that will ask you a series of
questions (e.g.: what connector to use, what formatter, which rules,
etc.). Answer them and you will end up with something similar to the
following:

```json
{
    "connector": {
        "name": "connectorName"
    },
    "formatters": ["formatterName"],
    "rules": {
        "rule1": "error",
        "rule2": "warning",
        "rule3": "off"
    },
    "rulesTimeout": 120000
    ...
}
```

Then you just have to run the following command to scan a website:

```bash
sonarwhal https://example.com
```

Wait a few seconds and you will get something similar to the following:

![Example output for the summary formatter](./concepts/images/summary-output.png)

It might take a few minutes to get some of the results. Some of the
rules (e.g.: [`SSL Labs`](./rules/ssllabs.md)) can take a few minutes
to report the results.

Now that you have your first result, is time to learn a bit more about
the different pieces:

* [Rules](./concepts/rules/)
* [Connectors](./concepts/connectors/)
* [Formatters](./concepts/formatters/)
* [Parsers](./concepts/parsers/)

### Permission issues during installation

If you receive an `EACCES` error when installing `sonarwhal`, it is caused
by installing packages globally. The recommended solution is to [change
`npm`’s default directory][npm change default directory] and then try
again. There have been reports of this issue when installing the
dependency `canvas-prebuilt` throws an `EACCES`. This [issue][permission
issue] was resolved adopting the recommended solution. You can find
detailed steps on how to change the npm default directory [here][npm
change default directory]. According to [npm’s documentation][npm use
package manager], if you have node installed using a package
manager like [Homebrew][homebrew] or [nvm][nvm], you may be able to avoid
the trouble of messing with the directories and have the correct
permissions set up right out of the box. As a result, you won’t experience
the error described above even if you install `sonarwhal` globally.

<!-- Link labels: -->

[homebrew]: https://brew.sh/
[nodejs]: https://nodejs.org/en/download/current/
[npm change default directory]: https://docs.npmjs.com/getting-started/fixing-npm-permissions#option-2-change-npms-default-directory-to-another-directory
[npm use package manager]: https://docs.npmjs.com/getting-started/fixing-npm-permissions#option-3-use-a-package-manager-that-takes-care-of-this-for-you
[nvm]: https://github.com/creationix/nvm
[permission issue]: https://github.com/sonarwhal/sonarwhal/issues/308
