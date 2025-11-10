package main

import (
        "log"

        "github.com/gin-gonic/gin"
        "github.com/vicradon/latex-renderer/internal/handlers"
)

func main() {
        r := gin.Default()
        r.Static("/static", "./static")

        r.LoadHTMLGlob("templates/*.html")

        handler := handlers.New()

        r.GET("/", handler.Index)
        r.POST("/render", handler.Render)

        log.Println("server running on http://0.0.0.0:1026")
        r.Run(":1026")
}
