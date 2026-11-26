# sales-office

## Scripts

| Command                | What it does                                                             |
| ---------------------- | ------------------------------------------------------------------------ |
| `npm run dev`          | Astro dev server for development                                         |
| `npm run test:server`  | Runs the app locally on `http://localhost:4322` for tests (CI does this) |
| `npm run test:install` | Installs Chromium for Playwright                                         |
| `npm run test:login`   | Login page tests (`@login`)                                              |
| `npm test`             | All Playwright tests                                                     |
| `npm run format:check` | Prettier formatting check                                                |

## Running tests locally like CI

CI (`.github/workflows/testing-pipeline.yml`) starts the app with `npm run test:server` and runs the tests against `localhost:4322`. To do the same locally:

```sh
npm run test:install   # once
npm run test:server    # terminal 1: app on port 4322
npm run test:login     # terminal 2: tests
```

The port is fixed (`--strictPort`): if 4322 is taken, the server fails to start instead of moving to another port.
