import React, {useState} from "react";
import '../styles/catalog.scss';
import Slider from '@mui/material/Slider';
import Pagination from "../components/pagination";
import ProductList from "../components/productList";

const Catalog = () => {
    const [valuePrice, setValuePrice] = useState([20, 37]);
    const [selectedCategory, setSelectedCategory] = useState('Сортировать');
    const [currentPage, setCurrentPage] = useState(1);

    const products = [
        { productId: 1, name: "Товар 1", newprice: 100, oldprice: 100, responsescore: 4.5, responsenum: 1200 },
        { productId: 2, name: "Товар 2", newprice: 200, oldprice: 100, responsescore: 4.5, responsenum: 1200 },
        { productId: 3, name: "Товар 3", newprice: 300, oldprice: 100, responsescore: 4.5, responsenum: 1200 },
        { productId: 4, name: "Товар 4", newprice: 400, oldprice: 100, responsescore: 4.5, responsenum: 1200 },
        { productId: 5, name: "Товар 5", newprice: 500, oldprice: 100, responsescore: 4.5, responsenum: 1200 },
        { productId: 6, name: "Товар 6", newprice: 600, oldprice: 100, responsescore: 4.5, responsenum: 1200 },
        { productId: 7, name: "Товар 7", newprice: 700, oldprice: 100, responsescore: 4.5, responsenum: 1200 },
        { productId: 8, name: "Товар 8", newprice: 800, oldprice: 100, responsescore: 4.5, responsenum: 1200 },
        { productId: 9, name: "Товар 9", newprice: 900, oldprice: 100, responsescore: 4.5, responsenum: 1200 }
    ];

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

    const categories = [
        { name: "Категория 1", count: 25 },
        { name: "Категория 2", count: 18 },
        { name: "Категория 3", count: 12 },
        { name: "Категория 4", count: 8 }
      ];

    return (
        <div>
            <div className="container_catalog">
                <div className="navbar_cat">
                    <div className="categ_cont">
                        <div className="titl_categ_cont">Категории</div>
                        <ul className="categ_list">
                            {categories.map((category, index) => (
                                <li className="categ_li" key={index}>{category.name} ({category.count})</li>
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
                                    {categories.map((category, index) => (
                                        <li><a key={index}>{category.name}</a></li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div className="productlist">
                        <ProductList products={products} page={currentPage} pageSize={pageSize} />
                        <Pagination totalProducts={products.length} pageSize={pageSize} onPageChange={handlePageChange} />
                    </div>
                </div>
                

            </div>
        </div>
    );
}

export default Catalog;
