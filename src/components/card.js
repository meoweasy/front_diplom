import React from "react";
import '../styles/catalog.scss';
import { Link } from 'react-router-dom';
import Carousel from 'react-material-ui-carousel'
import { Paper } from '@mui/material'

const ProductCard = ({ images, productId, name, description, newprice, oldprice, responsescore, responsenum }) => {
    return (
        <div className="product-card">
           <Carousel autoPlay={false} indicatorContainerProps={{ style: { position: 'absolute', top: '220px', zIndex: "1" } }}>
            {images.map((image, index) => (
              <Paper key={index} style={{ overflow: 'hidden' }}>
                <img
                  src={`data:image/png;base64,${image.imageData}`}
                  alt={`Image ${index}`}
                  width={'216px'}
                  height={'260px'}
                  style={{ borderRadius: '6px', objectFit: 'cover' }}
                />
              </Paper>
            ))}
          </Carousel>
          <Link to={`/catalog/${productId}`}>
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
          </Link>
        </div>
    );
};

export default ProductCard;