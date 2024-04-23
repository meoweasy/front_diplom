import React, {useState, useEffect} from "react";
import '../styles/data.scss';

const Data = () => {
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
    const numPerPage = 5;
    const maxSize = 5;

    const [dataCategory, setDataCategory] = useState([]);
    const [dataStock, setDataStock] = useState([]);

    const [currentPageCategory, setCurrentPageCategory] = useState(1);
    const [displayCategory, setDisplayCategory] = useState([]);
    const [searchCategory, setSearchCategory] = useState('');

    const [currentPageStock, setCurrentPageStock] = useState(1);
    const [displayStock, setDisplayStock] = useState([]);
    const [searchStock, setSearchStock] = useState('');

    const [isModalOpenCategory, setIsModalOpenCategory] = useState(false);
    const [isModalOpenStock, setIsModalOpenStock] = useState(false);

    const [nameCateg, setSelectedNameCateg] = useState('');
    const [file, setFile] = useState(null);
    const [fileBytes, setFileBytes] = useState(null);

    const numPagesCategory = () => {
        return Math.ceil(displayCategory.length / numPerPage);
    };
    const handlePageChangeCategory = (page) => {
        setCurrentPageCategory(page);
    };

    const numPagesStock = () => {
        return Math.ceil(displayStock.length / numPerPage);
    };
    const handlePageChangeStock = (page) => {
        setCurrentPageStock(page);
    };

    //Загрузка файла
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        
        if (selectedFile) {
          const reader = new FileReader();
          
          reader.readAsArrayBuffer(selectedFile);
    
          reader.onloadend = () => {
            const arrayBuffer = reader.result;
            const bytes = new Uint8Array(arrayBuffer);
            
            setFile(selectedFile);
            setFileBytes(bytes);
          };
        }
    };
    
    const removeFile = () => {
        setFile(null);
        setFileBytes(null);
    };
    

    useEffect(() => {
        const filteredDataCategory = dataCategory.filter(row =>
          row.name.toLowerCase().includes(searchCategory.toLowerCase())
        );
        setDisplayCategory(filteredDataCategory);
        setCurrentPageCategory(1);

        const filteredDataStock = dataStock.filter(row =>
            row.name.toLowerCase().includes(searchStock.toLowerCase())
          );
          setDisplayStock(filteredDataStock);
          setCurrentPageStock(1);
    }, [searchCategory, searchStock]);

    return (
        <div>
            <div className="data_container">
                <div className="data_category_container">
                    <div className="title_setting_category">Категории</div>
                    <div className="data_search_category">
                        <div className="col-md-2">Поиск:</div>
                        <div className="col-md-10">
                            <input
                                type="text"
                                className="search"
                                value={searchCategory}
                                onChange={(e) => setSearchCategory(e.target.value)}
                            />
                        </div>
                    </div>
                    <br/>
                    <table>
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataCategory.slice((currentPageCategory - 1) * numPerPage, currentPageCategory * numPerPage).map((row, index) => (
                                <tr key={index}>
                                    <td>{row.name}</td>
                                    <td><button className="close thick"></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        type={"categ"}
                        numPages={numPagesCategory()}
                        currentPage={currentPageCategory}
                        maxSize={maxSize}
                        onPageChange={handlePageChangeCategory}
                    />
                    <button className="add_category_btn" onClick={() => setIsModalOpenCategory(true)}>добавить</button>
                </div>

                <div className="data_stock_container">
                    <div className="title_setting_stock">Акции</div>
                    <div className="data_search_stock">
                        <div className="col-md-2">Поиск:</div>
                        <div className="col-md-10">
                            <input
                                type="text"
                                className="search"
                                value={searchStock}
                                onChange={(e) => setSearchStock(e.target.value)}
                            />
                        </div>
                    </div>
                    <br/>
                    <table>
                        <thead>
                            <tr>
                                <th>Изображение</th>
                                <th>Описание</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {dataStock.slice((currentPageStock - 1) * numPerPage, currentPageStock * numPerPage).map((row, index) => (
                                <tr key={index}>
                                    <td><img src={`data:image/png;base64,${row.image}`} style={{ width: '50px', height: '50px' }} /></td>
                                    <td>{row.description}</td>
                                    <td><button className="close thick"></button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination
                        type={"stock"}
                        numPages={numPagesStock()}
                        currentPage={currentPageStock}
                        maxSize={maxSize}
                        onPageChange={handlePageChangeStock}
                    />
                    <button className="add_category_btn" onClick={() => setIsModalOpenStock(true)}>добавить</button>
                </div>
            </div>
            {/* Модальное окно для добавления категории*/}
            {isModalOpenCategory && (
                <div className="modal_data_category">
                    <div className="modal_addcategory_container">
                        <div className="title_modal_addcategory">Добавление категории</div>

                        <div className="cont_namecateg">
                            <label for="namecateg" className="title_modal_namecateg">Название</label>
                            <input type="text" name="namecateg" value={nameCateg} onChange={(e) => setSelectedNameCateg(e.target.value)}></input>
                        </div>
                        
                        <div className="modal_schema_action">
                            <button >добавить</button>
                            <button onClick={() => setIsModalOpenCategory(false)}>отмена</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Модальное окно для добавления акции*/}
            {isModalOpenStock && (
                <div className="modal_data_stock">
                    <div className="modal_addstock_container">
                        <div className="title_modal_addstock">Добавление акции</div>

                        <textarea className='schema_desc' placeholder='Небольшое описание акции'></textarea>

                        <div className="input-file-row">
                            <label className="input-file">
                                <input 
                                type="file" 
                                name="file[]" 
                                accept="image/*" 
                                onChange={handleFileChange}
                                />
                                <span>выберите файл</span>
                            </label>
                            {file ? (
                                <div className="input-file-list">
                                    <div className="input-file-list-item">
                                        <img 
                                            className="input-file-list-img" 
                                            src={URL.createObjectURL(file)} 
                                            alt={file.name} 
                                        />
                                        <button 
                                            onClick={removeFile} 
                                            className="input-file-list-remove"
                                            >
                                            x
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="zagl">
                                    {/* Заглушка, если изображение не выбрано */}
                                </div>
                            )}
                        </div>
                        
                        <div className="modal_schema_action">
                            <button >добавить</button>
                            <button onClick={() => {
                                setIsModalOpenStock(false);
                                setFile(null);
                                setFileBytes(null);
                            }}>отмена</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
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

export default Data;