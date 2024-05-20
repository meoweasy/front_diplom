import React, {useState, useEffect} from "react";
import '../styles/catalog.scss';
import Slider from '@mui/material/Slider';
import Pagination from "../components/pagination";
import ProductList from "../components/productList";
import axios2 from '../config/axiosConfig';

const Catalog = () => {
    const [valuePrice, setValuePrice] = useState([20, 37]);
    const [selectedCategory, setSelectedCategory] = useState('Сортировать');
    const [currentPage, setCurrentPage] = useState(1);
    const [dataCategory, setDataCategory] = useState([]);
    const [dataProduct, setDataProduct] = useState([]);

    const fetchProduct = async () => {
        try {
            const response = await axios2.get(`/products`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await fetchProduct();
                setDataProduct(fetchedData);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        
        fetchData();
    }, []);

    const pageSize = 9;

    const handlePageChange = (page) => {
        setCurrentPage(page);
      };

    const handleItemClick = (categoryName) => {
        setSelectedCategory(categoryName);
    };

    const handleChangePrice = (event, newValue) => {
        setValuePrice(newValue);
    };

    const valuetext = (value) => {
        return `${value}₽`;
    };

    const fetchCategory = async () => {
        try {
            const response = await axios2.get(`/categories`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await fetchCategory();
                setDataCategory(fetchedData);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        
        fetchData();
    }, []);

    return (
        <div>
            <div className="container_catalog">
                <div className="navbar_cat">
                    <div className="categ_cont">
                        <div className="titl_categ_cont">Категории</div>
                        <ul className="categ_list">
                            {dataCategory.map((category, index) => (
                                <li className="categ_li" key={index}>{category.name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="price_cont">
                        <div className="titl_categ_cont">Стоимость</div>
                        <Slider
                            getAriaLabel={() => 'Стоимость'}
                            value={valuePrice}
                            onChange={handleChangePrice}
                            valueLabelDisplay="auto"
                            getAriaValueText={valuetext}
                            sx={{
                                marginTop: '10px',
                            '.MuiSlider-thumb': {
                                width: '13px', 
                                height: '13px', 
                            },
                            '.MuiSlider-valueLabel': {
                                fontSize: '12px',
                            }
                            }}
                        />
                    </div>
                </div>
                
                <div className="cont_main_catalog_card">
                    <div className="catalog_menu">
                        <div className="item_menu">
                            <img className="icon_menu" src="icons/menu.png" alt="" width={'15px'} height={'15px'}></img>
                            <img className="icon_menu" src="icons/reorder.png" alt="" width={'15px'} height={'15px'}></img>
                            <div className="dropdown2 hover">
                                <a href="/catalog">{selectedCategory}</a>
                                <ul>
                                    {/* {categories.map((category, index) => (
                                        <li><a key={index}>{category.name}</a></li>
                                    ))} */}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div className="productlist">
                        <ProductList products={dataProduct} page={currentPage} pageSize={pageSize} />
                        <Pagination totalProducts={dataProduct.length} pageSize={pageSize} onPageChange={handlePageChange} />
                    </div>
                </div>
                

            </div>
        </div>
    );
}

export default Catalog;
