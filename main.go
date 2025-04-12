package main

import (
	"log"
	"museum-api/controllers"
	"museum-api/database"
	"museum-api/services"

	"github.com/gin-gonic/gin"
)

func main() {
	log.Println("Starting Museum Artifact API...")

	database.ConnectDB()
	db := database.DB

	artifactService := services.NewArtifactService(db)

	artifactController := controllers.NewArtifactController(artifactService)

	router := gin.Default()

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
		})
	})

	artifactController.RegisterArtifactRoutes(router)

	port := "8080"
	log.Printf("Server starting on port %s\n", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatalf("Failed to run server: %v", err)
	}
}
