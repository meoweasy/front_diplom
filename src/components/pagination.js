import React from "react";

const Pagination = ({ totalProducts, pageSize, onPageChange }) => {
    const totalPages = Math.ceil(totalProducts / pageSize);

    const handlePageChange = (page) => {
        onPageChange(page);
    };

    return (
        <div className="pagination">
        {[...Array(totalPages)].map((_, index) => (
            <button key={index} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
            </button>
        ))}
        </div>
    );
};

export default Pagination;