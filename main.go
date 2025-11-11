package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/vicradon/latex-renderer/internal/handlers"
)

func main() {
	r := gin.Default()
	r.Static("/static", "./static")
	r.LoadHTMLGlob("templates/*")

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.tmpl", gin.H{
			"title": "LaTeX Renderer",
		})
	})

	r.POST("/render", handlers.RenderLatex)

	log.Println("Server running on http://0.0.0.0:1026")
	r.Run(":1026")
}
