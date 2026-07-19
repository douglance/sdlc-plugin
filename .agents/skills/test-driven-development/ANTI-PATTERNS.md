# Test Anti-Patterns

| Anti-Pattern | Problem | Fix |
|---|---|---|
| Testing implementation details | Tests break when refactoring even if behavior is unchanged | Test inputs and outputs, not internal structure |
| Flaky tests (timing, order-dependent) | Erode trust in the test suite | Use deterministic assertions, isolate test state |
| Testing framework code | Wastes time testing third-party behavior | Only test YOUR code |
| Snapshot abuse | Large snapshots nobody reviews, break on any change | Use snapshots sparingly and review every change |
| No test isolation | Tests pass individually but fail together | Each test sets up and tears down its own state |
| Mocking everything | Tests pass but production breaks | Prefer real implementations > fakes > stubs > mocks. Mock only at boundaries where real deps are slow or non-deterministic |
| Self-confirming test (tautological / can't fail) | Passes by construction, so it verifies nothing — a mock returns X then the test asserts X; a fixture mirrors its own assertion; the "expected" value is one the test itself set | Assert on behavior computed by real code, not on values the test supplied. Mutate the code and confirm the test goes red — a surviving mutant means the test can't fail |
