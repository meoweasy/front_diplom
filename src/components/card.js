import React from "react";
import '../styles/catalog.scss';
import { Link } from 'react-router-dom';

const ProductCard = ({ productId, name, newprice, oldprice, responsescore, responsenum }) => {
    return (
      <Link to={`/catalog/${productId}`}>
        <div className="product-card">
          <img src="image.jpg" alt="" width={'216px'} style={{ borderRadius: '6px' }}></img>
          <div className="desc_card">
              <div className="desc_price">
                  <div className="act">{newprice} ₽</div>
                  <div className="neact">{oldprice} ₽</div>
              </div>
              <div className="desc_name_card">{name}</div>
              <div className="response_cont">
                  <img src="icons/star.svg" alt="" width="13px" height="13px" />
                  <div className="response">{responsescore}</div>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#bfbfbf' }}></div>
                  <div className="num_resp">{responsenum}</div>
              </div>
          </div>
        </div>
      </Link>
    );
};

export default ProductCard;