# Issue 2754

MCVE for [/firebase/firebase-admin-node/issues/2754](https://github.com/firebase/firebase-admin-node/issues/2754).

GitHub Workflow should trigger the test, but if it doesn't work, it's also possible to test locally.

Please confirm that no default service account is set in the environment variables.

Hereafter, install the required packages:

```bash
cd tests && npm run test:setup
```

Then, run the test:

```bash
npm run test
```

Please take a look at the "Actions" tab in the repository to check the test status.
