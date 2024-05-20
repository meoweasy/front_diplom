import React, {useState, useEffect} from 'react';
import axios2 from '../config/axiosConfig';
import Select from 'react-select';
import Swal from 'sweetalert2';

const productTable = () => {
    const [dataProduct, setDataProduct] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState("");
    const [currentPageProduct, setCurrentPageProduct] = useState(1);
    const [displayProduct, setDisplayProduct] = useState([]);
    const [searchProduct, setSearchProduct] = useState('');
    const numPerPage = 5;
    const maxSize = 5;
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState('');
    const [isModalOpenProduct, setIsModalOpenProduct] = useState(false);
    const [files, setFiles] = useState([]);
    const [fileBytesList, setFileBytesList] = useState([]);

    const [nameProduct, setNameProduct] = useState("");
    const [deskProduct, setDeskProduct] = useState("");
    const [currentPrice, setCurrentPrice] = useState("");
    const [oldPrice, setOldPrice] = useState("");
    const [selectedCategory, setSelectedCategories] = useState([]);
    const [selectedSchema, setSelectedSchema] = useState("");

    const [dataCategory, setDataCategory] = useState([]);
    const [dataSchema, setDataSchema] = useState([]);

    const customStyles = {
        option: (provided, state) => ({
          ...provided,
          borderBottom: '1px dotted pink',
          color: state.isSelected ? 'red' : 'blue',
          padding: 20,
        }),
        control: () => ({
          // none of react-select's styles are passed to <Control />
          width: 200,
        }),
      };


    const handleImageClick = (imageBase64) => {
        setModalImage(imageBase64);
        setShowModal(true);
    }

    const numPagesProduct = () => {
        return Math.ceil(displayProduct.length / numPerPage);
    };

    const handlePageChangeProduct = (page) => {
        setCurrentPageProduct(page);
    };

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
                setDisplayProduct(fetchedData);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        
        fetchData();
    }, []);
    

    useEffect(() => {
        const filteredDisplayProduct = dataProduct.filter(row =>
            row.description.toLowerCase().includes(searchProduct.toLowerCase()) || 
            row.name.toLowerCase().includes(searchProduct.toLowerCase()) || 
            row.categories.some(category => category.name.toLowerCase().includes(searchProduct.toLowerCase()))
        );
        setDisplayProduct(filteredDisplayProduct);
        setCurrentPageProduct(1);
    }, [searchProduct]);

    const deleteProduct = async (id) => {
        try {
            await axios2.delete(`/products/${id}`);
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            throw error;
        }
    };

    const handleDeleteProduct = async (id) => {
        const result = await Swal.fire({
            title: 'Вы уверены?',
            text: 'Вы точно хотите удалить этот товар?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Да, удалить!',
            cancelButtonText: 'Отмена',
        });
    
        // Если пользователь подтвердил удаление
        if (result.isConfirmed) {
            try {
                await deleteProduct(id);
                const updatedData = await fetchProduct();
                setDisplayProduct(updatedData);
                Swal.fire({
                    title: 'Удалено!',
                    text: 'Товар успешно удален.',
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

    //Загрузка файла
    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        
        if (selectedFiles) {
            const newFiles = Array.from(selectedFiles);
            const newFileBytesList = [];
    
            // Проход по каждому выбранному файлу и добавление его в состояние
            newFiles.forEach((file) => {
                const reader = new FileReader();
                
                reader.readAsArrayBuffer(file);
        
                reader.onloadend = () => {
                    const arrayBuffer = reader.result;
                    const bytes = new Uint8Array(arrayBuffer);
                    
                    newFileBytesList.push(bytes);
                    if (newFileBytesList.length === newFiles.length) {
                        // Если загружены все файлы, обновляем состояние
                        setFiles(newFiles);
                        setFileBytesList(newFileBytesList);
                    }
                };
            });
        }
    };
    
    // Удаление файла по индексу
    const removeFile = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    
        const updatedFileBytesList = [...fileBytesList];
        updatedFileBytesList.splice(index, 1);
        setFileBytesList(updatedFileBytesList);
    };

    //получение категорий
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

    const toggleCategory = (categoryId) => {
        setSelectedCategories((prevCategories) =>
          prevCategories.includes(categoryId)
            ? prevCategories.filter((id) => id !== categoryId)
            : [...prevCategories, categoryId]
        );
    };

    //Получение схем
    const fetchSchema = async () => {
        try {
            const response = await axios2.get(`/schemas`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await fetchSchema();
                setDataSchema(fetchedData);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        
        fetchData();
    }, []);

    const handleChange = (selectedOption) => {
        setSelectedSchema(selectedOption);
    };

    //добавление
    const addProduct = async (newProduct) => {
        try {
            const formData = new FormData();
            formData.append('name', newProduct.name);
            formData.append('description', newProduct.description);
            formData.append('currentprice', newProduct.currentprice);
            formData.append('oldprice', newProduct.oldprice);
            formData.append('shema', newProduct.shema.id);

            formData.append('categories', JSON.stringify(newProduct.categories));
            files.forEach((file, index) => {
                formData.append(`images`, file);
            });
            
            const response = await axios2.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response;
        } catch (error) {
            console.error('Ошибка при добавлении:', error);
            throw error;
        }
    }

    const handleAddProduct = async () => {
    
        try {
            const product = {
                name: nameProduct,
                description: deskProduct,
                currentprice: currentPrice,
                oldprice: oldPrice,
                shema: selectedSchema,
                categories: selectedCategory,
                images: fileBytesList
            };
    
            const addedProduct = await addProduct(product);
            if (addedProduct.status === 201) {
                Swal.fire({
                    title: 'Добавлено!',
                    text: 'Товар успешно добавлен',
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
                text: error.message || 'Ошибка при добавлении товара',
            });
        }
    };

    return (
        <>
            <div className="data_container">
                <div className="title_setting_category">Товары</div>
                <div className="data_search_category">
                    <div className="col-md-2">Поиск:</div>
                    <div className="col-md-10">
                        <input
                            type="text"
                            className="search"
                            value={searchProduct}
                            onChange={(e) => setSearchProduct(e.target.value)}
                        />
                    </div>
                </div>
                <br/>
                <table>
                    <thead>
                        <tr>
                            <th>Категории</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Текущая стоимость</th>
                            <th>Старая стоимость</th>
                            <th>Схема</th>
                            <th>Изображения</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {displayProduct.slice((currentPageProduct- 1) * numPerPage, currentPageProduct * numPerPage).map((row, index) => (
                        <tr className="row-data" key={index}>
                            <td className="categories-column">
                                {row.categories.map((category, index) => (
                                    <span key={index}>{category.name} </span>
                                ))}
                            </td>
                            <td className="desc_column">{row.name}</td>
                            <td className="desc_column">{row.description}</td>
                            <td className="desc_column">{row.currentprice}</td>
                            <td className="desc_column">{row.oldprice}</td>
                            <td className="img_data">
                                <img
                                    src={`data:image/png;base64,${row.schema.imagefullschema}`}
                                    style={{ height: '100px', cursor: 'pointer' }}
                                    onClick={() => handleImageClick(row.schema.imagefullschema)}
                                />
                            </td>
                            <td className="img_data">
                                {row.images.map((image, index) => (
                                    <img
                                        key={index}
                                        src={`data:image/png;base64,${image.imageData}`}
                                        style={{ height: '100px', cursor: 'pointer', marginRight: '10px' }}
                                    />
                                ))}
                            </td>
                            <td><button className="close thick" onClick={() => handleDeleteProduct(row.id)}></button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Pagination
                    numPages={numPagesProduct()}
                    currentPage={currentPageProduct}
                    maxSize={maxSize}
                    onPageChange={handlePageChangeProduct}
                />
                <button className="add_category_btn" onClick={() => setIsModalOpenProduct(true)}>добавить</button>
            </div>
            {showModal &&
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <img src={`data:image/png;base64,${modalImage}`} alt="Full Size" height={"500px"}/>
                    </div>
                </div>
            }
            {isModalOpenProduct && (
                <div className="modal_data_product">
                    <div className="modal_addproduct_container">
                        <div className="title_modal_addproduct">Добавление товара</div>

                        <input type="text" placeholder='Название' value={nameProduct} onChange={(e) => {setNameProduct(e.target.value)}}></input>

                        <textarea className='product_desc' placeholder='Небольшое описание товара' value={deskProduct} onChange={(e) => {setDeskProduct(e.target.value)}}></textarea>

                        <input type="number" placeholder='Текущая стоимость' value={currentPrice} onChange={(e) => {setCurrentPrice(e.target.value)}}></input>
                        <input type="number" placeholder='Старая стоимость' value={oldPrice} onChange={(e) => {setOldPrice(e.target.value)}}></input>

                        <div className="title_modal_categ">Выберите категорию</div>
                        <div className="list_category">
                            {dataCategory.map(category => (
                                <div key={category.id}>
                                    <input
                                        type="checkbox"
                                        id={category.id}
                                        checked={selectedCategory.includes(category.id)}
                                        onChange={() => toggleCategory(category.id)}
                                    />
                                    <label htmlFor={category.id}>{category.name}</label>
                                </div>
                            ))}
                        </div>

                        <Select
                            options={dataSchema}
                            styles={customStyles}
                            value={selectedSchema}
                            onChange={handleChange}
                            isClearable
                            isSearchable
                            getOptionLabel={(option) => (
                                <div>
                                <img
                                    src={`data:image/png;base64,${option.imagefullschema}`}
                                    alt={option.label}
                                    style={{ height: '100px', marginRight: '10px' }}
                                />
                                {option.label}
                                </div>
                            )}
                            getOptionValue={(option) => option.value}
                        />


                        <div className="input-file-row">
                            <label className="input-file">
                                <input 
                                    type="file" 
                                    name="file[]" 
                                    accept="image/*" 
                                    multiple  // Разрешить выбор нескольких файлов
                                    onChange={handleFileChange}
                                />
                                <span>Выберите файлы</span>
                            </label>
                            {files.length > 0 ? (
                                <div className="input-file-list">
                                    {files.map((file, index) => (
                                        <div key={index} className="input-file-list-item">
                                            <img 
                                                className="input-file-list-img" 
                                                src={URL.createObjectURL(file)} 
                                                alt={file.name} 
                                            />
                                            <button 
                                                onClick={() => removeFile(index)} 
                                                className="input-file-list-remove"
                                            >
                                                x
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="zagl">
                                    {/* Заглушка, если изображение не выбрано */}
                                </div>
                            )}
                        </div>
                        
                        <div className="modal_schema_action">
                            <button onClick={handleAddProduct}>добавить</button>
                            <button onClick={() => {
                                setIsModalOpenProduct(false);
                                setFile(null);
                                setFileBytes(null);
                            }}>отмена</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

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
 
export default productTable;