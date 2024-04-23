import React, { useState, useEffect, useRef  } from 'react';
import axios2 from '../config/axiosConfig';

const CreatePic = ({ selectedColors, selectedImage }) => {
    const canvasRef = useRef(null);
    const outlineCanvasRef = useRef(null);
    const [status, setStatus] = useState('');
    const [isReady, setIsReady] = useState(false);
    const imgRef = useRef(null);
    const [currentImage, setCurrentImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [schemaDescription, setSchemaDescription] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [dataCategory, setDataCategory] = useState([]);

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

    const rgbToHex = (r, g, b) => {
        const toHex = (c) => {
            const hex = c.toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
    
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    };

    const handleAddSchema = async () => {
        if (!currentImage) return;
        try {
            const formData = new FormData();

            const coloredSchemaBlob = await canvasToBlob(canvasRef);
            formData.append('imagefullschema', coloredSchemaBlob, 'colored.png');

            const outlineBlob = await canvasToBlob(outlineCanvasRef);
            formData.append('imageschema', outlineBlob, 'outline.png');

            const hexColors = selectedColors.map(color => rgbToHex(color.r, color.g, color.b));
            formData.append('selectedColors', JSON.stringify(hexColors));

            formData.append('schemaDescription', schemaDescription);
            formData.append('selectedCategories', JSON.stringify(selectedCategories));

            formData.append('selectedImage', selectedImage, 'selectedImage.png');

            // Отправка FormData на сервер
            const response = await axios2.post('/schemas', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                console.log('Изображения успешно сохранены');
            }
        } catch (error) {
            console.error('Ошибка при сохранении изображений:', error);
        }
    };


    const toggleCategory = (categoryId) => {
        setSelectedCategories((prevCategories) =>
          prevCategories.includes(categoryId)
            ? prevCategories.filter((id) => id !== categoryId)
            : [...prevCategories, categoryId]
        );
    };

    const handleImageChange = (canvasRef) => {
        // Преобразование канваса в изображение
        const dataURL = canvasRef.current.toDataURL();
        const img = new Image();
        img.src = dataURL;
        setCurrentImage(img);
    };

    useEffect(() => {
        pbnify();
    }, [selectedImage, selectedColors]); 

    const pbnify = () => {
        setStatus('изображение преобразовывается в холст');
    
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            setStatus('изображение разбивается на матрицу');
            const mat = imageDataToSimpMat(imgData);
    
            const worker = new Worker(new URL('../utils/worker.ts', import.meta.url));
            worker.postMessage({ mat: mat });
    
            worker.onmessage = function (e) {
                const { status, matSmooth, labelLocs, matLine } = e.data;
    
                setStatus(status);
    
                if (status === 'схема почти сформирована, последние штрихи') {
                    displayResults(matSmooth, matLine, labelLocs);
                    setIsReady(true);
                    handleImageChange(canvasRef);
                }
            };
        };
        image.src = selectedImage;
    };

    const imageDataToSimpMat = (imgData) => {
        const mat = [];
        for (let i = 0; i < imgData.height; i++) {
            mat[i] = new Array(imgData.width);
        }
        for (let i = 0; i < imgData.data.length; i += 4) {
            const nearestI = getNearest({
                r: imgData.data[i],
                g: imgData.data[i + 1],
                b: imgData.data[i + 2]
            });
            const x = (i / 4) % imgData.width;
            const y = Math.floor(i / (4 * imgData.width));
            mat[y][x] = nearestI;
        }
        return mat;
    };

    const getNearest = (col) => {
        let nearest;
        let nearestDistsq = 1000000;
        for (let i = 0; i < selectedColors.length; i++) {
            const pcol = selectedColors[i];
            const distsq = Math.pow(pcol.r - col.r, 2) +
                Math.pow(pcol.g - col.g, 2) +
                Math.pow(pcol.b - col.b, 2);
            if (distsq < nearestDistsq) {
                nearest = i;
                nearestDistsq = distsq;
            }
        }
        return nearest;
    };

    const displayResults = (matSmooth, matLine, labelLocs) => {
        // Draw filled canvas
        const ctx2 = canvasRef.current.getContext("2d");
        const imgDataFilled = matToImageData(matSmooth, selectedColors, ctx2);
        console.log(imgDataFilled);
        ctx2.canvas.width = imgDataFilled.width;
        ctx2.canvas.height = imgDataFilled.height;
        ctx2.putImageData(imgDataFilled, 0, 0);
        const canvas = canvasRef.current;

        // Draw outlines canvas
        const ctx3 = outlineCanvasRef.current.getContext("2d");
        const gray = Math.round(255 * 0.5);
        const bw = [{ r: 255, g: 255, b: 255 }, { r: gray, g: gray, b: gray }];
        const imgDataOutline = matToImageData(matLine, bw, ctx3);
        ctx3.canvas.width = imgDataOutline.width;
        ctx3.canvas.height = imgDataOutline.height;
        ctx3.putImageData(imgDataOutline, 0, 0);
    
        // Draw numbers
        ctx3.font = "12px Georgia";
        ctx3.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
        labelLocs.forEach(labelLoc => {
            ctx3.fillText(labelLoc.value + 1, labelLoc.x - 3, labelLoc.y + 4);
        });
    };

    const matToImageData = (mat, palette, context) => {
        const imgData = context.createImageData(mat[0].length, mat.length);
        for (let y = 0; y < mat.length; y++) {
            for (let x = 0; x < mat[0].length; x++) {
                const i = (y * mat[0].length + x) * 4;
                const col = palette[mat[y][x]];
                imgData.data[i] = col.r;
                imgData.data[i + 1] = col.g;
                imgData.data[i + 2] = col.b;
                imgData.data[i + 3] = 255;
            }
        }
        return imgData;
    };

    const handleSaveImages = async () => {
        if (!currentImage) return;
    
        try {
            const formData = new FormData();
    
            // Преобразование раскрашенной схемы в Blob и добавление в FormData
            canvasRef.current.toBlob(async (blob) => {
                formData.append('imagefullschema', blob, 'colored.png');
            }, 'image/png');
    
            // Преобразование содержимого outlineCanvas в Blob и добавление в FormData
            outlineCanvasRef.current.toBlob(async (blob) => {
                formData.append('imageschema', blob, 'outline.png');
    
                // Преобразование массива paletteRGB в список строк и добавление в FormData
                selectedColors.forEach((color, index) => {
                    const hexColor = `#${color.r.toString(16)}${color.g.toString(16)}${color.b.toString(16)}`;
                    formData.append('palette', hexColor);
                });
    
                // Отправка FormData на сервер
                const response = await axios2.post('/api/schema/add', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                if (response.status === 201) {
                    console.log('Изображения успешно сохранены');
                }
            }, 'image/png');
    
        } catch (error) {
            console.error('Ошибка при сохранении изображений:', error);
        }
    };


    return (
        <div>
            {isReady === false && (
                <div className='container_ready_schema'>
                    <div className='cont_read'>
                        <div className="loadingio-spinner-rolling-nyflkjnkjoe"><div className="ldio-1tj2d9fybmc"><div></div></div></div>
                        <div className='status_schema'>{status}</div>
                    </div>
                </div>
            )}

            {isReady === true && (
                <div>
                    <div className='container_ready_schema2'>
                        {currentImage && <img src={currentImage.src} alt="" style={{ maxWidth: "100%", height: "100%", objectFit: "contain" }}/>}
                    </div>
                    <div className="pic_container">
                        <button onClick={() => handleImageChange(canvasRef)}>Раскрашенная схема</button>
                        <button onClick={() => handleImageChange(outlineCanvasRef)}>Схема</button>
                        <button onClick={() => setIsModalOpen(true)}>Сохранить</button>
                    </div>
                    {/* Модальное окно для добавления */}
                    {isModalOpen && (
                        <div className="modal_schema">
                            <div className="modal_schema_container">
                                <div className="title_modal_schema">Сохранение схемы</div>

                                <div className="title_modal_categ">Выберите категорию</div>
                                <div className="list_category">
                                    {dataCategory.map(({ row, index }) => (
                                        <div key={index}>
                                            <input
                                                type="checkbox"
                                                id={id}
                                                checked={selectedCategories.includes(id)}
                                                onChange={() => toggleCategory(id)}
                                            />
                                            <label htmlFor={index}>{row.name}</label>
                                        </div>
                                    ))}
                                </div>

                                <textarea
                                    className='schema_desc'
                                    placeholder='Небольшое описание схемы'
                                    value={schemaDescription}
                                    onChange={(e) => setSchemaDescription(e.target.value)}
                                ></textarea>
                                
                                <div className="modal_schema_action">
                                    <button onClick={handleAddSchema}>добавить</button>
                                    <button onClick={() => setIsModalOpen(false)}>отмена</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <canvas ref={outlineCanvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default CreatePic;