package handlers

import (
        "github.com/gin-gonic/gin"
        "net/http"
)

type Handler struct {
}

func New() *Handler {
        return &Handler{}
}

func (h *Handler) Index(c *gin.Context) {
        c.HTML(http.StatusOK, "index.html", gin.H{})
}

func (h *Handler) Render(c *gin.Context) {
        latex := c.PostForm("latex")
        if latex == "" {
                c.HTML(http.StatusOK, "result.html", gin.H{
                        "Error": "empty LaTeX input",
                })
                return
        }

        c.HTML(http.StatusOK, "result.html", gin.H{
                "ImagePath": "/static/images/example.png",
        })
}
