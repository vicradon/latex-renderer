package handlers

import (
	"bytes"
	"net/http"
	"os/exec"
	"strings"

	"github.com/gin-gonic/gin"
)

type RenderRequest struct {
	Latex string `json:"latex" binding:"required"`
}

type RenderResponse struct {
	Success bool   `json:"success"`
	Image   string `json:"image,omitempty"`
	Error   string `json:"error,omitempty"`
}

func RenderLatex(c *gin.Context) {
	var req RenderRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, RenderResponse{
			Success: false,
			Error:   "Invalid request",
		})
		return
	}

	imageData, err := renderLatexToImage(req.Latex)
	if err != nil {
		c.JSON(http.StatusOK, RenderResponse{
			Success: false,
			Error:   err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, RenderResponse{
		Success: true,
		Image:   imageData,
	})
}

func renderLatexToImage(latex string) (string, error) {
	latexDoc := `\documentclass[12pt]{article}
\usepackage{amsmath}
\usepackage{amssymb}
\pagestyle{empty}
\begin{document}
\[
` + latex + `
\]
\end{document}`

	cmd := exec.Command("bash", "-c", `
		tmpdir=$(mktemp -d)
		cd $tmpdir
		cat > input.tex
		latex -interaction=nonstopmode input.tex > /dev/null 2>&1
		dvipng -D 150 -T tight -bg Transparent -o output.png input.dvi > /dev/null 2>&1
		if [ -f output.png ]; then
			base64 output.png
			exitcode=0
		else
			echo "Failed to render LaTeX"
			exitcode=1
		fi
		cd /
		rm -rf $tmpdir
		exit $exitcode
	`)

	cmd.Stdin = strings.NewReader(latexDoc)
	var out bytes.Buffer
	var stderr bytes.Buffer
	cmd.Stdout = &out
	cmd.Stderr = &stderr

	err := cmd.Run()
	if err != nil {
		if stderr.Len() > 0 {
			return "", &RenderError{stderr.String()}
		}
		return "", &RenderError{"Failed to render LaTeX. Make sure latex and dvipng are installed."}
	}

	return out.String(), nil
}

type RenderError struct {
	msg string
}

func (e *RenderError) Error() string {
	return e.msg
}
