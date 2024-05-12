import React, {useState, useEffect, useMemo} from "react";
import '../styles/palleteTable.scss';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import axios2 from '../config/axiosConfig';
import Swal from 'sweetalert2';

const PalleteTable = () => {
    const numPerPage = 11;
    const maxSize = 9;
    const [isModalOpenColor, setIsModalOpenColor] = useState(false);
    const [searchColor, setSearchColor] = useState('');
    const [currentPageColor, setCurrentPageColor] = useState(1);
    const [displayColor, setDisplayColor] = useState([]);
    const [data, setData] = useState([]);
    
    const [hexValue, setHexValue] = useState('');
    const [colorName, setColorName] = useState('');
    const [colorType, setColorType] = useState('');
    const [colorCovering, setColorCovering] = useState('');
    const [manufacturer, setManufacturer] = useState('');
    const [nameLine, setNameLine] = useState('');
    const [colorNum, setColorNum] = useState('');
    const [volume, setVolume] = useState('');

    const [pegments, setPegments] = useState([]);
    const [pegmentInput, setPegmentInput] = useState('');

    const addPegment = () => {
        if (pegmentInput.trim() !== '') {
        setPegments([...pegments, pegmentInput]);
        setPegmentInput('');
        }
    };

    const removePegment = (indexToRemove) => {
        const updatedSegments = pegments.filter((_, index) => index !== indexToRemove);
        setPegments(updatedSegments);
    };

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: 'ascending',
    });

    const sortedData = useMemo(() => {
        const sortableData = [...displayColor];
        if (sortConfig.key !== null) {
          sortableData.sort((a, b) => {
            if (sortConfig.key === 'pegments') {
              const nameA = a[sortConfig.key][0]?.name || '';
              const nameB = b[sortConfig.key][0]?.name || '';
              return sortConfig.direction === 'ascending' 
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
            }
            return sortConfig.direction === 'ascending' 
              ? a[sortConfig.key].localeCompare(b[sortConfig.key])
              : b[sortConfig.key].localeCompare(a[sortConfig.key]);
          });
        }
        return sortableData;
    }, [displayColor, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
          direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
      
    const getSortDirection = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction;
    };

    const numPagesColor = () => {
        return Math.ceil(displayColor.length / numPerPage);
    };
    const handlePageChangeColor = (page) => {
        setCurrentPageColor(page);
    };

    const fetchColors = async () => {
        try {
            const response = await axios2.get(`/palletes`);
            return response.data;
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const fetchedData = await fetchColors();
                setData(fetchedData);
                setDisplayColor(fetchedData);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };
        
        fetchData();
    }, []);
    
    useEffect(() => {
        const filteredDataColor = data.filter(row =>
            Object.values(row).some(value =>
                typeof value === 'string' && value.toLowerCase().includes(searchColor.toLowerCase())
            ) ||
            (row.pegments && row.pegments.some(pegment => 
                pegment.name && pegment.name.toLowerCase().includes(searchColor.toLowerCase())
            ))
        );
        
        setDisplayColor(filteredDataColor);
        setCurrentPageColor(1);
    }, [searchColor]);
    


    const addColor = async (newColor) => {
        try {
            const response = await axios2.post(`/palletes`, newColor);
            return response.data;
        } catch (error) {
            console.error('Ошибка при добавлении цвета:', error);
            throw error;
        }
    };

    const handleAddColor = async () => {
        // Проверка на заполненность всех полей
        if (!hexValue || !colorName || !colorType || !colorCovering || !manufacturer || !nameLine || !volume) {
            Swal.fire({
                icon: 'error',
                title: 'Ошибка',
                text: 'Все поля должны быть заполнены',
            });
            return;
        }
    
        const newColor = {
            hex: hexValue,
            name: colorName,
            typecolor: colorType,
            coveringability: colorCovering,
            manufacturer: manufacturer,
            nameline: nameLine,
            num: colorNum,
            pegments: pegments,
            volume: volume,
            remainingvolume: volume
        };
    
        try {
            const addedColor = await addColor(newColor);
            const updatedData = await fetchColors();
            // Обновление отображаемых данных и сброс формы
            setDisplayColor(updatedData);
            setCurrentPageColor(1);
            setHexValue('');
            setColorName('');
            setColorType('');
            setColorCovering('');
            setManufacturer('');
            setNameLine('');
            setColorNum('');
            setVolume('');
            setPegments([]);
            setIsModalOpenColor(false);
            Swal.fire({
                title: 'Добавлено!',
                text: 'Цвет успешно добавлен',
                icon: 'success',
                timer: 2000,
                timerProgressBar: true,
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Ошибка',
                text: 'Ошибка при добавлении цвета',
            });
        }
    };

    const deleteColor = async (id) => {
        try {
            await axios2.delete(`/palletes/${id}`);
        } catch (error) {
            console.error('Ошибка при удалении цвета:', error);
            throw error;
        }
    };

    const handleDeleteColor = async (id) => {
        // Показываем модальное окно с подтверждением удаления
        const result = await Swal.fire({
            title: 'Вы уверены?',
            text: 'Вы точно хотите удалить этот цвет?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Да, удалить!',
            cancelButtonText: 'Отмена',
        });
    
        // Если пользователь подтвердил удаление
        if (result.isConfirmed) {
            try {
                await deleteColor(id);
                const updatedData = await fetchColors();
                setDisplayColor(updatedData);
                Swal.fire({
                    title: 'Удалено!',
                    text: 'Цвет успешно удален.',
                    icon: 'success',
                    timer: 2000,
                    timerProgressBar: true,
                });
            } catch (error) {
                console.error('Ошибка при удалении цвета:', error);
                // Уведомление об ошибке
                Swal.fire({
                    title: 'Ошибка',
                    text: 'Произошла ошибка при удалении цвета.',
                    icon: 'error',
                    timer: 2000,
                    timerProgressBar: true,
                });
            }
        }
    };

    return (
        <div>
            <div className="container_pallete_data">
                <div className="title_setting_category">Палитра</div>
                <div className="data_search_category">
                    <div className="col-md-2">Поиск:</div>
                    <div className="col-md-10">
                        <input
                            type="text"
                            className="search"
                            value={searchColor}
                            onChange={(e) => setSearchColor(e.target.value)}
                        />
                    </div>
                </div>
                <table className="table_pallete_data">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('hex')}>
                                HEX {getSortDirection('hex') === 'ascending' ? '▲' : '▼'}
                            </th>
                            <th onClick={() => requestSort('name')}>
                                Название {getSortDirection('name') === 'ascending' ? '▲' : '▼'}
                            </th>
                            <th onClick={() => requestSort('typecolor')}>
                                Тип краски {getSortDirection('typecolor') === 'ascending' ? '▲' : '▼'}
                            </th>
                            <th onClick={() => requestSort('coveringability')}>
                                Кроющая способность {getSortDirection('coveringability') === 'ascending' ? '▲' : '▼'}
                            </th>
                            <th onClick={() => requestSort('manufacturer')}>
                                Производитель {getSortDirection('manufacturer') === 'ascending' ? '▲' : '▼'}
                            </th>
                            <th onClick={() => requestSort('nameline')}>
                                Линейка {getSortDirection('nameline') === 'ascending' ? '▲' : '▼'}
                            </th>
                            <th onClick={() => requestSort('num')}>
                                Номер {getSortDirection('num') === 'ascending' ? '▲' : '▼'}
                            </th>
                            <th onClick={() => requestSort('pegments')}>
                                Пегменты {getSortDirection('pegments') === 'ascending' ? '▲' : '▼'}
                            </th>
                            <th onClick={() => requestSort('volume')}>
                                Объем {getSortDirection('volume') === 'ascending' ? '▲' : '▼'}
                            </th>
                            <th onClick={() => requestSort('remainingvolume')}>
                                Оставшийся объем {getSortDirection('remainingvolume') === 'ascending' ? '▲' : '▼'}
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.slice((currentPageColor - 1) * numPerPage, currentPageColor * numPerPage).map((row, index) => (
                            <tr key={index}>
                                <td style={{ backgroundColor: row.hex, border: `1px solid ${row.hex}` }}>{row.hex}</td>
                                <td>{row.name}</td>
                                <td>{row.typecolor}</td>
                                <td>{row.coveringability}</td>
                                <td>{row.manufacturer}</td>
                                <td>{row.nameline}</td>
                                <td>{row.num}</td>
                                <td>
                                    {row.pegments.map((pegment, index) => (
                                        <span key={index}>{pegment} </span>
                                    ))}
                                </td>
                                <td>{row.volume} мл</td>
                                <td>{row.remainingvolume} мл</td>
                                <td><button className="close thick" onClick={() => handleDeleteColor(row.id)}></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="pag_container">
                    <Pagination
                            type={"categ"}
                            numPages={numPagesColor()}
                            currentPage={currentPageColor}
                            maxSize={maxSize}
                            onPageChange={handlePageChangeColor}
                    />
                    <button className="add_category_btn" onClick={() => setIsModalOpenColor(true)}>добавить</button>
                </div>
            </div>
            {/* Модальное окно для добавления цвета*/}
            {isModalOpenColor && (
                <div className="modal_data_color">
                    <div className="modal_addcolor_container">
                        <div className="title_modal_addcolor">Добавление цвета</div>

                        <div className="cont_namecolor">
                            <label htmlFor="hex" className="title_modal_hex">HEX:</label>
                            <input type="text" name="hex" value={hexValue} onChange={(e) => setHexValue(e.target.value)} />
                        </div>

                        <div className="cont_namecolor">
                            <label htmlFor="color_name" className="title_modal_hex">Название:</label>
                            <input type="text" name="color_name" value={colorName} onChange={(e) => setColorName(e.target.value)} />
                        </div>

                        <select name="color_type" value={colorType} onChange={(e) => setColorType(e.target.value)}>
                            <option value="">--Выберите тип краски--</option>
                            <option value="Акриловая">Акриловая</option>
                            <option value="Маслянная">Маслянная</option>
                        </select>

                        <select name="color_covering" value={colorCovering} onChange={(e) => setColorCovering(e.target.value)}>
                            <option value="">--Выберите кроющую способность--</option>
                            <option value="Укрывистая">Укрывистая</option>
                            <option value="Полупрозрачная">Полупрозрачная</option>
                            <option value="Прозрачная">Прозрачная</option>
                        </select>

                        <div className="cont_namecolor">
                            <label htmlFor="color_manufacturer" className="title_modal_hex">Производитель:</label>
                            <input type="text" name="color_manufacturer" value={manufacturer} onChange={(e) => setManufacturer(e.target.value)} />
                        </div>

                        <div className="cont_namecolor">
                            <label htmlFor="color_nameline" className="title_modal_hex">Линейка:</label>
                            <input type="text" name="color_nameline" value={nameLine} onChange={(e) => setNameLine(e.target.value)} />
                        </div>

                        <div className="cont_namecolor">
                            <label htmlFor="color_num" className="title_modal_hex">Номер:</label>
                            <input type="text" name="color_num" value={colorNum} onChange={(e) => setColorNum(e.target.value)} />
                        </div>

                        <div className="cont_namecolor2">
                            <div className="title_modal_peg">Пегменты</div>
                            <input
                                type="text"
                                name="color_pegment"
                                value={pegmentInput}
                                onChange={(e) => setPegmentInput(e.target.value)}
                            />
                            <button name="color_pegment" onClick={addPegment}>Добавить</button>
                            <div className="sp_peg">
                                {pegments.map((pegment, index) => (
                                    <div key={index}>
                                        {pegment}
                                        <IconButton onClick={() => removePegment(index)}>
                                            <ClearIcon sx={{ fontSize: 15 }} />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="cont_namecolor">
                            <label htmlFor="color_volume" className="title_modal_hex">Объем:</label>
                            <input type="text" name="color_volume" value={volume} onChange={(e) => setVolume(e.target.value)} />
                        </div>

                        <div className="modal_schema_action">
                            <button onClick={handleAddColor}>добавить</button>
                            <button onClick={() => setIsModalOpenColor(false)}>отмена</button>
                        </div>
                    </div>
                </div>
            )}
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
export default PalleteTable;