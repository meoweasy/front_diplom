import React, {useState, useEffect} from "react";
import '../styles/shemaTable.scss';

const ShemaTable = () => {
    const categories = [
        { name: "Категория 1"},
        { name: "Категория 2" },
        { name: "Категория 3" },
        { name: "Категория 4" },
        { name: "Категория 5" },
        { name: "Категория 6" },
        { name: "Категория 7" },
        { name: "Категория 8" },
        { name: "Категория 9" },
        { name: "Категория 10" },
        { name: "Категория 11" },
    ];
    const schema = [
        { name: "Схема1"},
        { name: "Схема2" },
        { name: "Схема2 3" },
        { name: "Схема2 4" },
        { name: "Схема2 5" },
        { name: "Схема2 6" },
        { name: "Схема2 7" },
        { name: "Схема2 8" },
        { name: "Схема2 9" },
        { name: "Схема2 10" },
        { name: "Схема2 11" },
    ];
    const numPerPage = 5;
    const maxSize = 5;

    const [currentPageCategory, setCurrentPageCategory] = useState(1);
    const [displayCategory, setDisplayCategory] = useState([]);
    const [searchCategory, setSearchCategory] = useState('');

    const numPagesCategory = () => {
        return Math.ceil(schema.length / numPerPage);
    };
    const handlePageChangeCategory = (page) => {
        setCurrentPageCategory(page);
    };

    return (
        <div>
            <div className="data_container">
                    <div className="title_setting_category">Схемы</div>
                    <div className="data_search_category">
                        <div className="col-md-2">Поиск:</div>
                        <div className="col-md-10">
                            <input
                                type="text"
                                className="search"
                                // value={searchCategory}
                                // onChange={(e) => setSearchCategory(e.target.value)}
                            />
                        </div>
                    </div>
                    <br/>
                    <table>
                        <thead>
                            <tr>
                                <th>Категория</th>
                                <th>Описание</th>
                                <th>Палитра</th>
                                <th>Оригинал</th>
                                <th>Раскрашенная схема</th>
                                <th>Схема</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                        {schema.slice((currentPageCategory - 1) * numPerPage, currentPageCategory * numPerPage).map((row, index) => (
                            <tr key={index}>
                                <td>{row.name}</td>
                                <td>
                                    {/* <select 
                                        style={{ width: '100%', height: '100%', border: 'none', background: 'transparent' }}
                                        defaultValue={row.name}
                                        disabled
                                    >
                                        {schema.map((item, idx) => (
                                            <option key={idx} value={item.name}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select> */}
                                </td>
                                <td><button className="close thick"></button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <Pagination
                        numPages={numPagesCategory()}
                        currentPage={currentPageCategory}
                        maxSize={maxSize}
                        onPageChange={handlePageChangeCategory}
                    />
                    <button className="add_category_btn" onClick={() => setIsModalOpenCategory(true)}>добавить</button> 
                </div>
        </div>
    );
}

const Pagination = ({ numPages, currentPage, maxSize, onPageChange }) => {
    const pages = Array.from({ length: numPages }, (_, i) => i + 1);
    const boundaryLinks = true;
  
    const handlePageClick = (page) => {
      onPageChange(page);
    };
  
    return (
      <div className="pag_all" data-pagination="" data-num-pages={numPages} data-current-page={currentPage} data-max-size={maxSize} data-boundary-links={boundaryLinks}>
        {pages.map((page) => (
          <button className="pag" key={page} onClick={() => handlePageClick(page)}>{page}</button>
        ))}
      </div>
    );
};

export default ShemaTable;