package main

import (
	"embed"
	"os"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// WebKitGTK 2.40+ (the webkit2_41 build) defaults to a DMABUF renderer that
	// renders text without antialiasing on many Linux GPU/driver combos, leaving
	// fonts jagged. Disabling it restores smooth glyphs. Must be set before the
	// webview is created; ignored on non-Linux platforms.
	os.Setenv("WEBKIT_DISABLE_DMABUF_RENDERER", "1")

	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "dailydrift",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
