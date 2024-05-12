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
            <ProductCard key={index} productId={product.productId} name={product.name} newprice={product.newprice} oldprice={product.oldprice} responsescore={product.responsescore} responsenum={product.responsenum} />
        ))}
        </div>
    );
};

export default ProductList;