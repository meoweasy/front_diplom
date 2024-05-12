import React, {useState, useEffect} from "react";
import '../styles/shemaTable.scss';
import axios2 from "../config/axiosConfig";
import Swal from 'sweetalert2';

const ShemaTable = () => {
    const [dataSchema, setDataSchema] = useState([]);
    const [selectedSchema, setSelectedSchema] = useState("");
    const [currentPageSchema, setCurrentPageSchema] = useState(1);
    const [displaySchema, setDisplaySchema] = useState([]);
    const [searchSchema, setSearchSchema] = useState('');
    const numPerPage = 5;
    const maxSize = 5;
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState('');

    const handleImageClick = (imageBase64) => {
        setModalImage(imageBase64);
        setShowModal(true);
    }

    const numPagesSchema = () => {
        return Math.ceil(displaySchema.length / numPerPage);
    };
    const handlePageChangeSchema = (page) => {
        setCurrentPageSchema(page);
    };
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
                setDisplaySchema(fetchedData);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        
        fetchData();
    }, []);
    

    useEffect(() => {
        const filteredDisplaySchema = dataSchema.filter(row =>
            row.description.toLowerCase().includes(searchSchema.toLowerCase()) || 
            row.categories.some(category => category.name.toLowerCase().includes(searchSchema.toLowerCase())) ||
            row.palletes.some(pallete => pallete.hex.toLowerCase().includes(searchSchema.toLowerCase()))
        );
        setDisplaySchema(filteredDisplaySchema);
        setCurrentPageSchema(1);
    }, [searchSchema]);

    const deleteSchema = async (id) => {
        try {
            await axios2.delete(`/schemas/${id}`);
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            throw error;
        }
    };

    const handleDeleteSchema = async (id) => {
        const result = await Swal.fire({
            title: 'Вы уверены?',
            text: 'Вы точно хотите удалить эту схему?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Да, удалить!',
            cancelButtonText: 'Отмена',
        });
    
        // Если пользователь подтвердил удаление
        if (result.isConfirmed) {
            try {
                await deleteSchema(id);
                const updatedData = await fetchSchema();
                setDisplaySchema(updatedData);
                Swal.fire({
                    title: 'Удалено!',
                    text: 'Схема успешно удалена.',
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
                <div className="title_setting_category">Схемы</div>
                <div className="data_search_category">
                    <div className="col-md-2">Поиск:</div>
                    <div className="col-md-10">
                        <input
                            type="text"
                            className="search"
                            value={searchSchema}
                            onChange={(e) => setSearchSchema(e.target.value)}
                        />
                    </div>
                </div>
                <br/>
                <table>
                    <thead>
                        <tr>
                            <th>Категории</th>
                            <th>Описание</th>
                            <th>Палитра</th>
                            <th>Оригинал</th>
                            <th>Раскрашенная схема</th>
                            <th>Схема</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                    {displaySchema.slice((currentPageSchema- 1) * numPerPage, currentPageSchema * numPerPage).map((row, index) => (
                        <tr className="row-data" key={index}>
                            <td className="categories-column">
                                {row.categories.map((category, index) => (
                                    <span key={index}>{category.name} </span>
                                ))}
                            </td>
                            <td className="desc_column">{row.description}</td>
                            <td className="pal_column">
                                {row.palletes.map((pallete, index) => (
                                    <span style={{ backgroundColor: pallete.hex }} key={index}>{pallete.hex}</span>
                                ))}
                            </td>
                            <td className="img_data">
                                <img
                                    src={`data:image/png;base64,${row.imageoriginalschema}`}
                                    style={{ height: '100px', cursor: 'pointer' }}
                                    onClick={() => handleImageClick(row.imageoriginalschema)}
                                />
                            </td>
                            <td className="img_data">
                                <img
                                    src={`data:image/png;base64,${row.imagefullschema}`}
                                    style={{ height: '100px', cursor: 'pointer' }}
                                    onClick={() => handleImageClick(row.imagefullschema)}
                                />
                            </td>
                            <td className="img_data">
                                <img
                                    src={`data:image/png;base64,${row.imageschema}`}
                                    style={{ height: '100px', cursor: 'pointer' }}
                                    onClick={() => handleImageClick(row.imageschema)}
                                />
                            </td>
                            <td><button className="close thick" onClick={() => handleDeleteSchema(row.id)}></button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <Pagination
                    numPages={numPagesSchema()}
                    currentPage={currentPageSchema}
                    maxSize={maxSize}
                    onPageChange={handlePageChangeSchema}
                />
            </div>
            {showModal &&
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)}>&times;</span>
                        <img src={`data:image/png;base64,${modalImage}`} alt="Full Size" height={"500px"}/>
                    </div>
                </div>
            }
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