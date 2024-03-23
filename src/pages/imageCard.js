import React, { useEffect, useState } from 'react';

const ImageCard = ({ imageUrl, altText }) => {
  return (
    <div className="image-card">
      <img src={imageUrl} alt={altText} />
    </div>
  );
};

export default ImageCard;
