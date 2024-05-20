import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import axios2 from '../config/axiosConfig';
import '../styles/catalog.scss';
import Carousel from 'react-material-ui-carousel';
import { Paper } from '@mui/material'

const ProductDetails = () => {
  const { productId } = useParams();
  const [dataProduct, setDataProduct] = useState([]);

  const fetchProductId = async () => {
    try {
        const response = await axios2.get(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        throw error;
    }
  };


  useEffect(() => {
      const fetchData = async () => {
          try {
              const fetchedData = await fetchProductId();
              setDataProduct(fetchedData);
          } catch (error) {
              console.error('Ошибка при загрузке данных:', error);
          }
      };
      
      fetchData();
  }, []);
  
  
  return (
    <div className='prod_detail_container'>
      <div className="product_info">
        <div className="images_product">
          <Carousel autoPlay={false} /*indicatorContainerProps={{ style: { position: 'absolute', top: '220px', zIndex: "1" } }}*/>
            {dataProduct.images && dataProduct.images.map((image, index) => (
              <Paper key={index} style={{ overflow: 'hidden' }}>
                  <div key={index}>
                    <img src={`data:image/png;base64,${image.imageData}`} alt={`Product ${index}`}
                    width={'445px'}
                    height={'445px'}
                    style={{ borderRadius: '6px', objectFit: "contain"}} />
                  </div>
              </Paper>
            ))}
          </Carousel>
        </div>
        <div className="main_info_prod">
          <div className="categ_inf">
            Категории:
            {dataProduct.categories && dataProduct.categories.map((cat, index) => (
              <div>{cat.name}</div>
            ))}
          </div>
          <div className="name_prod">{dataProduct.name}</div>
          <div className="desc_prd_info">{dataProduct.description}</div>
          <div className="price_info">
            <div className="price_now">{dataProduct.currentprice}  ₽</div>
            <div className="price_old">{dataProduct.oldprice}  ₽</div>
          </div>
          <div className="rate_info"></div>
          <button className='zak_prod_inf'>Заказать</button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;