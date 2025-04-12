package database

import (
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"

	"museum-api/models"
)

var DB *gorm.DB

func ConnectDB() {
	var err error

	dsn := "host=101.201.49.155 user=myuser password=secretpassword dbname=mydatabase port=5432 sslmode=disable TimeZone=Asia/Shanghai"

	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})

	if err != nil {
		log.Fatalf("Failed to connect to database: %v\n", err)
		os.Exit(1)
	}

	log.Println("Database connection successfully opened")

	log.Println("Running Migrations")
	err = DB.AutoMigrate(&models.Artifact{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v\n", err)
		os.Exit(1)
	}

	log.Println("Database Migrated")
}
