import React, { useState, useEffect, useRef  } from 'react';
import axios2 from '../config/axiosConfig';
import Swal from 'sweetalert2';

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
    
        return `#${toHex(r).toUpperCase()}${toHex(g).toUpperCase()}${toHex(b).toUpperCase()}`;
    };
    

    async function canvasToBlob(canvasRef) {
        const canvas = canvasRef.current;
        return new Promise((resolve, reject) => {
            try {
                canvas.toBlob(blob => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        const dataURL = canvas.toDataURL();
                        const mimeType = dataURL.split(',')[0].split(':')[1].split(';')[0];
                        const byteString = atob(dataURL.split(',')[1]);
                        const arrayBuffer = new ArrayBuffer(byteString.length);
                        const uint8Array = new Uint8Array(arrayBuffer);
    
                        for (let i = 0; i < byteString.length; i++) {
                            uint8Array[i] = byteString.charCodeAt(i);
                        }
    
                        const blob = new Blob([arrayBuffer], { type: mimeType });
                        resolve(blob);
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
    
    async function urlToBlob(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Ошибка при загрузке изображения');
            }
            return await response.blob();
        } catch (error) {
            throw error;
        }
    }

    const addSchema = async (newSchema) => {
        try {
            const formData = new FormData();
            formData.append('schemaDescription', newSchema.schemaDescription);
            formData.append('selectedImage', newSchema.selectedImageBlob);
            formData.append('imagefullschema', newSchema.imagefullschemaBlob);
            formData.append('imageschema', newSchema.imageschemaBlob);
            formData.append('selectedCategories', JSON.stringify(newSchema.selectedCategories));
            formData.append('selectedColors', JSON.stringify(newSchema.selectedColors));

            
            const response = await axios2.post('/schemas', formData, {
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

    const handleAddSchema = async () => {
        if (!currentImage) return;
    
        try {
            // Получаем реальные данные из обещаний
            const selectedImageBlob = await urlToBlob(selectedImage);
            const imagefullschemaBlob = await canvasToBlob(canvasRef);
            const imageschemaBlob = await canvasToBlob(outlineCanvasRef);
    
            const schema = {
                selectedCategories: selectedCategories.map(id => id.toString()),
                selectedColors: selectedColors.map(color => rgbToHex(color.r, color.g, color.b)),
                schemaDescription: schemaDescription,
                selectedImageBlob: selectedImageBlob,
                imagefullschemaBlob: imagefullschemaBlob,
                imageschemaBlob: imageschemaBlob
            };
    
            const addedStock = await addSchema(schema);
            if (addedStock.status === 201) {
                Swal.fire({
                    title: 'Добавлено!',
                    text: 'Схема успешно добавлена',
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
                text: error.message || 'Ошибка при добавлении схемы',
            });
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
                                    {dataCategory.map(category => (
                                        <div key={category.id}>
                                            <input
                                                type="checkbox"
                                                id={category.id}
                                                checked={selectedCategories.includes(category.id)}
                                                onChange={() => toggleCategory(category.id)}
                                            />
                                            <label htmlFor={category.id}>{category.name}</label>
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