package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Artifact struct {
	ID          uuid.UUID      `gorm:"type:uuid;primary_key;" json:"id"`
	Name        string         `gorm:"not null" json:"name"`
	Era         string         `gorm:"not null" json:"era"`
	Image       string         `gorm:"not null" json:"image"`
	Category    string         `gorm:"not null" json:"category"`
	Description string         `json:"description"`
	Likes       int            `gorm:"default:0" json:"likes"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type Page[T any] struct {
	Items      []T   `json:"items"`
	Page       int   `json:"page"`
	PerPage    int   `json:"perPage"`
	TotalItems int64 `json:"totalItems"`
	TotalPages int   `json:"totalPages"`
}

func (artifact *Artifact) BeforeCreate(tx *gorm.DB) (err error) {
	if artifact.ID == uuid.Nil {
		artifact.ID = uuid.New()
	}
	return
}
