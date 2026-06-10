dev:
    wails dev -tags webkit2_41

lint-go:
    golangci-lint run ./dailydrift/...

[working-directory('frontend')]
lint:
    pnpm exec biome check .
