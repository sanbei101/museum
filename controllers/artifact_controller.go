package controllers

import (
	"fmt"
	"log"
	"museum-api/models"
	"museum-api/services"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type ArtifactController struct {
	artifactService services.ArtifactService
}

func NewArtifactController(service services.ArtifactService) *ArtifactController {
	return &ArtifactController{artifactService: service}
}

func (c *ArtifactController) CreateArtifactHandler(ctx *gin.Context) {
	var newArtifact models.Artifact

	if err := ctx.ShouldBindJSON(&newArtifact); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body: " + err.Error()})
		return
	}

	if newArtifact.Name == "" || newArtifact.Era == "" || newArtifact.Category == "" || newArtifact.Image == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields: name, era, category, image"})
		return
	}

	createdArtifact, err := c.artifactService.CreateArtifact(&newArtifact)
	if err != nil {

		log.Printf("Error creating artifact: %v\n", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create artifact"})
		return
	}

	ctx.JSON(http.StatusCreated, createdArtifact)
}

func (c *ArtifactController) GetArtifactByIDHandler(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	artifact, err := c.artifactService.GetArtifactByID(id)
	if err != nil {

		if err.Error() == fmt.Sprintf("artifact with ID %s not found", id) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			log.Printf("Error fetching artifact by ID %s: %v\n", idStr, err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve artifact"})
		}
		return
	}

	ctx.JSON(http.StatusOK, artifact)
}

func (c *ArtifactController) GetAllArtifactsHandler(ctx *gin.Context) {
	pageStr := ctx.DefaultQuery("page", "1")
	perPageStr := ctx.DefaultQuery("perPage", "10")

	page, err := strconv.Atoi(pageStr)
	if err != nil || page < 1 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid page number"})
		return
	}

	perPage, err := strconv.Atoi(perPageStr)
	if err != nil || perPage < 1 {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid perPage value"})
		return
	}

	if perPage > 100 {
		perPage = 100
	}

	pagedResult, err := c.artifactService.GetAllArtifacts(page, perPage)
	if err != nil {
		log.Printf("Error fetching all artifacts: %v\n", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve artifacts"})
		return
	}

	ctx.JSON(http.StatusOK, pagedResult)
}

func (c *ArtifactController) UpdateArtifactHandler(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	var updateData models.Artifact
	if err := ctx.ShouldBindJSON(&updateData); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body: " + err.Error()})
		return
	}

	updateData.ID = uuid.Nil

	updatedArtifact, err := c.artifactService.UpdateArtifact(id, &updateData)
	if err != nil {
		if err.Error() == fmt.Sprintf("artifact with ID %s not found", id) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			log.Printf("Error updating artifact ID %s: %v\n", idStr, err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update artifact"})
		}
		return
	}

	ctx.JSON(http.StatusOK, updatedArtifact)
}

func (c *ArtifactController) DeleteArtifactHandler(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	err = c.artifactService.DeleteArtifact(id)
	if err != nil {
		if err.Error() == fmt.Sprintf("artifact with ID %s not found or already deleted", id) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			log.Printf("Error deleting artifact ID %s: %v\n", idStr, err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete artifact"})
		}
		return
	}

	ctx.Status(http.StatusNoContent)
}

func (c *ArtifactController) LikeArtifactHandler(ctx *gin.Context) {
	idStr := ctx.Param("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid UUID format"})
		return
	}

	updatedArtifact, err := c.artifactService.IncrementLike(id)
	if err != nil {
		if err.Error() == fmt.Sprintf("artifact with ID %s not found", id) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		} else {
			log.Printf("Error incrementing like for artifact ID %s: %v\n", idStr, err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to increment like"})
		}
		return
	}

	ctx.JSON(http.StatusOK, updatedArtifact)
}

func (c *ArtifactController) RegisterArtifactRoutes(router *gin.Engine) {
	artifactRoutes := router.Group("/artifacts")
	{
		artifactRoutes.POST("", c.CreateArtifactHandler)
		artifactRoutes.GET("/:id", c.GetArtifactByIDHandler)
		artifactRoutes.GET("", c.GetAllArtifactsHandler)
		artifactRoutes.PUT("/:id", c.UpdateArtifactHandler)
		artifactRoutes.DELETE("/:id", c.DeleteArtifactHandler)

		artifactRoutes.POST("/:id/like", c.LikeArtifactHandler)
	}
}
