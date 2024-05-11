import React, {useState, useEffect} from "react";
import '../styles/data.scss';
import Swal from 'sweetalert2';
import axios2 from '../config/axiosConfig';

const Data = () => {
    const numPerPage = 5;
    const maxSize = 5;

    const [dataCategory, setDataCategory] = useState([]);
    const [dataStock, setDataStock] = useState([]);
    const [selectedStock, setSelectedStock] = useState("");

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

    const fetchStocks = async () => {
        try {
            const response = await axios2.get(`/stocks`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await fetchStocks();
                setDataStock(fetchedData);
                setDisplayStock(fetchedData);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        
        fetchData();
    }, []);
    

    useEffect(() => {
        const filteredDisplayStock = dataStock.filter(row =>
            row.description.toLowerCase().includes(searchStock.toLowerCase())
        );
        setDisplayStock(filteredDisplayStock);
        setCurrentPageStock(1);
    }, [searchStock]);

    const addStock = async (newStock) => {
        try {
            const formData = new FormData();
            formData.append('description', newStock.description);
            formData.append('imagestock', newStock.imagestock);
    
            const response = await axios2.post(`/stocks`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error) {
            console.error('Ошибка при добавлении:', error);
            throw error;
        }
    };
    
    const handleAddStock = async () => {
        if (!selectedStock || !fileBytes) {
            Swal.fire({
                icon: 'error',
                title: 'Ошибка',
                text: 'Все данные должны быть загружены',
            });
            return;
        }
    
        const stock = {
            description: selectedStock,
            imagestock: new Blob([fileBytes], { type: 'application/octet-stream' }),
        };
    
        try {
            const addedStock = await addStock(stock);
            if (addedStock.status === 201) {
                const updatedData = await fetchStocks();
                setDisplayStock(updatedData);
                setIsModalOpenStock(false);
                Swal.fire({
                    title: 'Добавлено!',
                    text: 'Акция успешно добавлена',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                });
            }
        } catch (error) {
            console.error(error); // Выводим всю ошибку для диагностики
            Swal.fire({
                icon: 'error',
                title: 'Ошибка',
                text: error.message || 'Ошибка при добавлении акции',
            });
        }
    };

    const deleteStock = async (id) => {
        try {
            await axios2.delete(`/stocks/${id}`);
        } catch (error) {
            console.error('Ошибка при удалении цвета:', error);
            throw error;
        }
    };

    const handleDeleteStock = async (id) => {
        // Показываем модальное окно с подтверждением удаления
        const result = await Swal.fire({
            title: 'Вы уверены?',
            text: 'Вы точно хотите удалить эту акцию?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Да, удалить!',
            cancelButtonText: 'Отмена',
        });
    
        // Если пользователь подтвердил удаление
        if (result.isConfirmed) {
            try {
                await deleteStock(id);
                const updatedData = await fetchStocks();
                setDisplayStock(updatedData);
                Swal.fire({
                    title: 'Удалено!',
                    text: 'Акция успешно удалена.',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                });
            } catch (error) {
                console.error('Ошибка при удалении :', error);
                // Уведомление об ошибке
                Swal.fire({
                    title: 'Ошибка',
                    text: 'Произошла ошибка при удалении.',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                });
            }
        }
    };

    //работа с категориями

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
                setDisplayCategory(fetchedData);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        
        fetchData();
    }, []);
    

    useEffect(() => {
        const filteredDisplayCategory = dataCategory.filter(row =>
            row.name.toLowerCase().includes(searchCategory.toLowerCase())
        );
        setDisplayCategory(filteredDisplayCategory);
        setCurrentPageCategory(1);
    }, [searchCategory]);

    const addCategory = async (newCategory) => {
        try {
            const formData = {
                name: newCategory.name,
            };
    
            const response = await axios2.post(`/categories`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return response;
        } catch (error) {
            console.error('Ошибка при добавлении:', error);
            throw error;
        }
    };
    
    const handleAddCategory = async () => {
        if (!nameCateg) {
            Swal.fire({
                icon: 'error',
                title: 'Ошибка',
                text: 'Напишите название',
            });
            return;
        }
    
        const category = {
            name: nameCateg
        };
    
        try {
            const addedCategory = await addCategory(category);
            if (addedCategory.status === 200) {
                const updatedData = await fetchCategory();
                setDisplayCategory(updatedData);
                setIsModalOpenCategory(false);
                Swal.fire({
                    title: 'Добавлено!',
                    text: 'Категория успешно добавлена',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                });
            }
        } catch (error) {
            console.error(error);
            Swal.fire({
                icon: 'error',
                title: 'Ошибка',
                text: error.message || 'Ошибка при добавлении',
            });
        }
    };

    const deleteCategory = async (id) => {
        try {
            await axios2.delete(`/categories/${id}`);
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            throw error;
        }
    };

    const handleDeleteCategory = async (id) => {
        const result = await Swal.fire({
            title: 'Вы уверены?',
            text: 'Вы точно хотите удалить эту категорию?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Да, удалить!',
            cancelButtonText: 'Отмена',
        });
    
        // Если пользователь подтвердил удаление
        if (result.isConfirmed) {
            try {
                await deleteCategory(id);
                const updatedData = await fetchCategory();
                setDisplayCategory(updatedData);
                Swal.fire({
                    title: 'Удалено!',
                    text: 'Категория успешно удалена.',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                });
            } catch (error) {
                console.error('Ошибка при удалении :', error);
                // Уведомление об ошибке
                Swal.fire({
                    title: 'Ошибка',
                    text: 'Произошла ошибка при удалении.',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                });
            }
        }
    };


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
                            {displayCategory.slice((currentPageCategory - 1) * numPerPage, currentPageCategory * numPerPage).map((row, index) => (
                                <tr key={index}>
                                    <td>{row.name}</td>
                                    <td><button className="close thick" onClick={() => handleDeleteCategory(row.id)}></button></td>
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
                            {displayStock.slice((currentPageStock - 1) * numPerPage, currentPageStock * numPerPage).map((row, index) => (
                                <tr key={index}>
                                    <td><img src={`data:image/png;base64,${row.imagestock}`} style={{ width: '50px', height: '50px' }} /></td>
                                    <td>{row.description}</td>
                                    <td><button className="close thick" onClick={() => handleDeleteStock(row.id)}></button></td>
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
                            <button onClick={handleAddCategory}>добавить</button>
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

                        <textarea className='schema_desc' placeholder='Небольшое описание акции' value={selectedStock} onChange={(e) => {setSelectedStock(e.target.value)}}></textarea>

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
                            <button onClick={handleAddStock}>добавить</button>
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