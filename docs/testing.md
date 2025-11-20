# Testing Guide

Docify uses Vitest + Testing Library. Commands:

```bash
npm test              # run unit tests
npm run test:ui       # run tests with the UI watcher
npm run test:coverage # run with coverage reporting
```

Add new tests for features that touch Convex functions, editor tooling, or UI
components to keep regressions low.

