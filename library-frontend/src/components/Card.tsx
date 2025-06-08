import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ContentCard,
  ContentCardBody,
  ContentCardSubtitle,
  ContentCardTitle,
} from '@visa/nova-react';
import { VisaFavoriteStarFillTiny, VisaFavoriteStarOutlineTiny } from '@visa/nova-icons-react';
import { BookCardProps } from '../types/libraryTypes';
import { BadgeInfo } from './Badge';

const BookCard = ({
  id,
  title,
  author,
  genre,
  imageUrl,
  isFavorite,
  toggleFavorite,
  className = '',
}: BookCardProps) => {
  const navigate = useNavigate();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(`/books/${id}`);
    }
  };

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  return (
    <ContentCard
      borderBlockEnd
      className={`book-card ${className}`}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${title}`}
      onClick={() => navigate(`/books/${id}`)}
      onKeyDown={handleKeyDown}
    >
      <div className="book-card__image-container">
        <img
          src={imageUrl}
          alt={`Cover of ${title}`}
          className="book-card__image"
          draggable={false}
          loading='lazy'
        />
      </div>
      <ContentCardBody className="book-card__body">
      <ContentCardTitle variant="headline-4" className="book-card__title">
  {title}
  <span
    role="button"
    tabIndex={0}
    onClick={handleStarClick}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleStarClick(e as any);
      }
    }}
    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    className={`book-card__star ${isFavorite ? 'book-card__star--favorite' : ''}`}
    aria-pressed={isFavorite}
  >
    {isFavorite ? (
      <VisaFavoriteStarFillTiny aria-hidden="true" />
    ) : (
      <VisaFavoriteStarOutlineTiny aria-hidden="true" />
    )}
  </span>
</ContentCardTitle>
        <ContentCardSubtitle variant="subtitle-3" className="book-card__subtitle">
          {author}
        </ContentCardSubtitle>
        <ContentCardSubtitle variant="subtitle-3" className="book-card__subtitle">
        <BadgeInfo 
                  label={genre}
                  badgeType="stable"
                
                />
        </ContentCardSubtitle>
      </ContentCardBody>
    </ContentCard>
  );
};

export default BookCard;