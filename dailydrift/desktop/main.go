package desktop

import (
	"context"
	"embed"
	"fmt"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

func RunWails(ctx context.Context, assets embed.FS) error {
	a := NewApp(ctx)
	err := wails.Run(&options.App{
		Title:  "dailydrift",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        a.startup,
		Bind: []any{
			a,
		},
	})
	if err != nil {
		return fmt.Errorf("wails: %w", err)
	}
	return nil
}
