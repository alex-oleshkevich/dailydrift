dev:
    wails dev -tags webkit2_41

[working-directory: 'frontend']
lint:
    pnpm exec biome check .
