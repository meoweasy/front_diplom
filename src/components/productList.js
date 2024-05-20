import React from "react";
import ProductCard from "./card";
import '../styles/catalog.scss';

const ProductList = ({ products, page, pageSize }) => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedProducts = products.slice(start, end);

    return (
        <div className="product-list">
        {paginatedProducts.map((product, index) => (
            <ProductCard key={index} images={product.images} productId={product.id} name={product.name} description={product.description} newprice={product.currentprice} oldprice={product.oldprice} responsescore={product.responsescore} responsenum={product.responsenum} />
        ))}
        </div>
    );
};

export default ProductList;