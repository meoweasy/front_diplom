import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails = () => {
  const { productId } = useParams();
  
  
  return (
    <div>
      <h2>Страница товара {productId}</h2>
      {/* Здесь отобразить информацию о товаре */}
    </div>
  );
};

export default ProductDetails;