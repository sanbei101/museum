package services

import (
	"errors"
	"fmt"
	"math"
	"museum-api/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type ArtifactService interface {
	CreateArtifact(artifact *models.Artifact) (*models.Artifact, error)
	GetArtifactByID(id uuid.UUID) (*models.Artifact, error)
	GetAllArtifacts(page, perPage int) (*models.Page[models.Artifact], error)
	UpdateArtifact(id uuid.UUID, updateData *models.Artifact) (*models.Artifact, error)
	DeleteArtifact(id uuid.UUID) error
	IncrementLike(id uuid.UUID) (*models.Artifact, error)
}

type artifactService struct {
	db *gorm.DB
}

func NewArtifactService(db *gorm.DB) ArtifactService {
	return &artifactService{db: db}
}

func (s *artifactService) CreateArtifact(artifact *models.Artifact) (*models.Artifact, error) {

	if err := s.db.Create(artifact).Error; err != nil {
		return nil, err
	}
	return artifact, nil
}

func (s *artifactService) GetArtifactByID(id uuid.UUID) (*models.Artifact, error) {
	var artifact models.Artifact
	if err := s.db.First(&artifact, "id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, fmt.Errorf("artifact with ID %s not found", id)
		}
		return nil, err
	}
	return &artifact, nil
}

func (s *artifactService) GetAllArtifacts(page, perPage int) (*models.Page[models.Artifact], error) {
	var artifacts []models.Artifact
	var totalItems int64

	if page < 1 {
		page = 1
	}
	if perPage < 1 {
		perPage = 10
	}

	offset := (page - 1) * perPage

	if err := s.db.Model(&models.Artifact{}).Count(&totalItems).Error; err != nil {
		return nil, err
	}

	if err := s.db.Offset(offset).Limit(perPage).Find(&artifacts).Error; err != nil {
		return nil, err
	}

	totalPages := int(math.Ceil(float64(totalItems) / float64(perPage)))

	resultPage := &models.Page[models.Artifact]{
		Items:      artifacts,
		Page:       page,
		PerPage:    perPage,
		TotalItems: totalItems,
		TotalPages: totalPages,
	}

	return resultPage, nil
}

func (s *artifactService) UpdateArtifact(id uuid.UUID, updateData *models.Artifact) (*models.Artifact, error) {

	existingArtifact, err := s.GetArtifactByID(id)
	if err != nil {
		return nil, err
	}

	err = s.db.Model(existingArtifact).Omit("ID", "CreatedAt", "DeletedAt").Updates(updateData).Error
	if err != nil {
		return nil, err
	}

	return existingArtifact, nil
}

func (s *artifactService) DeleteArtifact(id uuid.UUID) error {

	result := s.db.Delete(&models.Artifact{}, id)

	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return fmt.Errorf("artifact with ID %s not found or already deleted", id)
	}

	return nil
}

func (s *artifactService) IncrementLike(id uuid.UUID) (*models.Artifact, error) {
	var artifact models.Artifact

	err := s.db.Transaction(func(tx *gorm.DB) error {

		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).First(&artifact, "id = ?", id).Error; err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return fmt.Errorf("artifact with ID %s not found", id)
			}
			return err
		}

		artifact.Likes++

		if err := tx.Save(&artifact).Error; err != nil {
			return err
		}
		return nil
	})

	if err != nil {
		return nil, err
	}

	return &artifact, nil
}
