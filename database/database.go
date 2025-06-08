package database

import (
	"fmt"
	"log"
	"math/rand"
	"museum-api/models"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

var imageList = []string{
	"https://images.unsplash.com/photo-1644176041496-393d63975fba",
	"https://images.unsplash.com/photo-1695902263752-992a68bb8a5e",
	"https://images.unsplash.com/photo-1628074958552-7c9d0b4173b7",
	"https://images.unsplash.com/photo-1695902263752-992a68bb8a5e",
	"https://images.unsplash.com/photo-1745655604884-dd4fad590504",
	"https://images.unsplash.com/photo-1695902263725-96a82974d297",
	"https://images.unsplash.com/photo-1695902046953-1bf8caee5ac3",
	"https://images.unsplash.com/photo-1618722060945-b87f7326995b",
	"https://images.unsplash.com/photo-1742495212324-d488f48d0502",
}

var eraList = []string{
	"唐代",
	"宋代",
	"元代",
	"明代",
	"清代",
}

var categoryList = []string{
	"陶瓷",
	"青铜器",
	"玉器",
	"书画",
	"金银器",
	"石器",
	"漆器",
	"织绣",
	"文房四宝",
	"其他",
}

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
	DB.Migrator().DropTable(&models.Artifact{})
	err = DB.AutoMigrate(&models.Artifact{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v\n", err)
		os.Exit(1)
	}

	// 插入100条初始数据
	artifacts := make([]models.Artifact, 0, 100)
	for i := 0; i < 100; i++ {
		artifact := models.Artifact{
			Name:        "文物" + fmt.Sprint(i+1),
			Category:    categoryList[i%len(categoryList)],
			Description: "这是文物的描述" + fmt.Sprint(i+1),
			Image:       imageList[i%len(imageList)],
			Era:         eraList[i%len(eraList)],
			Likes:       rand.Intn(100), // 随机生成0-99之间的点赞数
		}
		artifacts = append(artifacts, artifact)
	}
	if err := DB.Create(&artifacts).Error; err != nil {
		log.Fatalf("Failed to insert initial data: %v\n", err)
		os.Exit(1)
	}
	log.Println("Database Migrated")
}
