import React, {useState, useEffect, useRef} from "react";
import '../styles/schema.scss';
import SettingBlock from "../components/settingBlock";
import Cropper from 'react-easy-crop';
import { getOrientation } from "get-orientation";
import { getCroppedImg } from '../utils/canvasUtils';
import CreatePic from "../components/createPic";
import ColorThief from 'colorthief';
import  { Slider } from 'material-ui-slider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import ClearIcon from '@mui/icons-material/Clear';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

const Schema = () => {
    const [selectedImage, setImageSrc] = useState(null);
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [orient, setOrient] = useState('портрет');
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);

    const [showCreatePic, setShowCreatePic] = useState(false);
    const canvasRef = useRef(null);
    const [paletteRGB, setPaletteRGB] = useState([]);
    const [numberOfColors, setNumberOfColors] = useState('');

    const handleButtonClick3 = () => {
        setShowCreatePic(true);
    };

    useEffect(() => {
        const showCroppedImage = async () => {
            if (currentBlockIndex === 2 && selectedImage && croppedAreaPixels) {
                try {
                    const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels, rotation);
                    setCroppedImage(croppedImage);
                } catch (e) {
                    console.error(e);
                }
            }
        };
        showCroppedImage();
    }, [currentBlockIndex, selectedImage, croppedAreaPixels]);

    const handleButtonClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleNext = () => {
        setCurrentBlockIndex(prevIndex => prevIndex + 1);
    };

    const handlePrev = () => {
        setCurrentBlockIndex(prevIndex => prevIndex - 1);
    };

    const handleImageClick = (event) => {
        const image = event.target;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);

        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;

        const pixelData = ctx.getImageData(x, y, 1, 1).data;
        const color = {
            r: pixelData[0],
            g: pixelData[1],
            b: pixelData[2]
        };

        setPaletteRGB(prevColors => [...prevColors, color]);
    };

    const onCropChange = crop => {
        setCrop(crop);
    };

    const onRotationChange = rotation => {
        setRotation(rotation);
    };

    const onZoomChange = zoom => {
        setZoom(zoom);
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    };


    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
    
            try {
                // Чтение содержимого файла в формате данных URL
                let imageDataUrl = await readFile(file);
    
                // Применение поворота, если это необходимо
                const orientation = await getOrientation(file);
                const rotation = ORIENTATION_TO_ANGLE[orientation];
                if (rotation) {
                    imageDataUrl = await getRotatedImage(imageDataUrl, rotation);
                }
    
                // Установка полученных данных изображения
                setImageSrc(imageDataUrl);
            } catch (e) {
                console.error('Ошибка при обработке изображения:', e);
            }
        }
    };
    
    const ORIENTATION_TO_ANGLE = {
        '3': 180,
        '6': 90,
        '8': -90,
    };
    
    // Пример определения функции getRotatedImage
    const getRotatedImage = async (imageDataUrl, rotation) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
    
                if (rotation === 90 || rotation === -90) {
                    canvas.width = img.height;
                    canvas.height = img.width;
                } else {
                    canvas.width = img.width;
                    canvas.height = img.height;
                }
    
                ctx.translate(canvas.width / 2, canvas.height / 2);
                ctx.rotate(rotation * Math.PI / 180);
                ctx.drawImage(img, -img.width / 2, -img.height / 2);
    
                canvas.toBlob(blob => {
                    resolve(blob);
                }, 'image/jpeg');
            };
    
            img.onerror = error => reject(error);
    
            img.src = imageDataUrl;
        });
    };

    const readFile = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.addEventListener('load', () => resolve(reader.result), false)
            reader.readAsDataURL(file)
        })
    };

    const getColorPalette = () => {
        const colorThief = new ColorThief();
        const image = new Image();
        image.crossOrigin = 'Anonymous'; // Разрешение на загрузку изображения с другого домена

        image.onload = () => {
            const dominantColor = colorThief.getColor(image);
            const numColors = parseInt(numberOfColors, 10);
            const colorPalette = colorThief.getPalette(image, numColors); // Получение палитры цветов из изображения

            // Фильтрация палитры, чтобы исключить похожие цвета
            const filteredPalette = filterSimilarColors(dominantColor, colorPalette);

            const rgbPalette = filteredPalette.map(color => ({
                r: color[0],
                g: color[1],
                b: color[2]
            }));
            setPaletteRGB(rgbPalette);
        };

        image.src = croppedImage;
    };
    
    // Функция для фильтрации похожих цветов в палитре
    const filterSimilarColors = (dominantColor, colorPalette) => {
        const filteredPalette = [dominantColor]; // Добавление доминантного цвета в палитру
        const threshold = 50; // Порог для определения похожести цветов
    
        // Фильтрация похожих цветов
        colorPalette.forEach(color => {
          if (!isSimilarColor(color, filteredPalette, threshold)) {
            filteredPalette.push(color);
          }
        });
    
        return filteredPalette;
    };
    
    // Функция для определения похожести цветов
    const isSimilarColor = (color, palette, threshold) => {
    for (let i = 0; i < palette.length; i++) {
        const dist = Math.sqrt(
        Math.pow(color[0] - palette[i][0], 2) +
        Math.pow(color[1] - palette[i][1], 2) +
        Math.pow(color[2] - palette[i][2], 2)
        );

        if (dist < threshold) {
        return true;
        }
    }
    return false;
    };
    
    // Конвертация RGB в HEX
    const rgbToHex = (rgb) => {
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
    };

    const handleColorRemoval = (indexToRemove) => {
        setPaletteRGB(prevPalette => prevPalette.filter((_, index) => index !== indexToRemove));
    };

    const reload = () => {
        window.location.reload(false)
    }

    return (
        <div>
            <div className="schema">
                <div className="schema_cont">
                    <div className="setting_block">
                        <div className="title_setting">Настройки</div>
                        <SettingBlock
                            key={0}
                            number={1}
                            header={'Изображение'} 
                            expandedHeight={'200px'} 
                            isFirst={true} isLast={false} 
                            onNext={handleNext} 
                            onPrev={handlePrev} 
                            isVisible={currentBlockIndex === 0}>
                            <div className="pic_cont">
                                <div className="subtitle_pic">Загрузите изображение с устройства</div>
                                <button className="add_pic" onClick={handleButtonClick}>Загрузить</button>
                                <input
                                    id="fileInput"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={onFileChange}
                                />
                                {selectedImage ? (
                                    <div className="img_info">
                                        <img
                                            src={selectedImage}
                                            alt="Uploaded"
                                            style={{ maxWidth: '60px', maxHeight: '60px' }}
                                        />
                                        <p className="title_img">{selectedImage.name}</p>
                                    </div>
                                ) : (
                                    <div className="img_info"></div>
                                )}
                            </div>
                        </SettingBlock>
                        <SettingBlock 
                            key={1} 
                            number={2} 
                            header={'Формат'}  
                            expandedHeight={'330px'} 
                            isFirst={false} 
                            isLast={false} 
                            onNext={handleNext} 
                            onPrev={handlePrev} 
                            isVisible={currentBlockIndex === 1}>
                            <div className="format_cont">
                                <div className="subtitle_pic">Выберите нужный формат изображения и осуществите подгонку фото под изображение, затем перейдите к следующему этапу</div>
                                <div className="orient_text">Выберите формат</div>
                                <div className="check_orient">
                                    <div className="radio_cast">
                                        <input
                                            type="radio"
                                            id="alb"
                                            value="портрет"
                                            checked={orient === 'портрет'}
                                            onChange={(event) => setOrient(event.target.value)}
                                        />
                                        <label htmlFor="alb" className="orient_label">портрет</label>
                                    </div>
                                    <div className="radio_cast">
                                        <input
                                            type="radio"
                                            id="kn"
                                            value="альбом"
                                            checked={orient === 'альбом'}
                                            onChange={(event) => setOrient(event.target.value)}
                                        />
                                        <label htmlFor="kn" className="orient_label">альбом</label>
                                    </div>
                                    <div className="radio_cast">
                                        <input
                                            type="radio"
                                            id="kn"
                                            value="квадрат"
                                            checked={orient === 'квадрат'}
                                            onChange={(event) => setOrient(event.target.value)}
                                        />
                                        <label htmlFor="kn" className="orient_label">квадрат</label>
                                    </div>
                                </div>
                                <div className="form_text">Вращение</div>
                                <Slider
                                    min={0}
                                    max={360}
                                    step={1}
                                    aria-labelledby="Rotation"
                                    value={rotation}
                                    onChange={(value) => setRotation(value)}
                                    title={rotation}
                                />
                            </div>
                        </SettingBlock>
                        <SettingBlock
                            key={2}
                            number={3}
                            header={'Палитра'} 
                            expandedHeight={'510px'} 
                            isFirst={false}
                            isLast={false} 
                            onNext={handleNext} 
                            onPrev={handlePrev} 
                            isVisible={currentBlockIndex === 2}>
                            <div className="pic_cont">
                                <div className="subtitle_pic">Вы можете автоматически сформировать палитру, выбрав количество цветов (можно не выбирать, количество будет сформировано автоматически). Для добавления цветов, щелкните по точкам на изображении.</div>
                                <TextField
                                    id="outlined-number"
                                    label="Количество цветов"
                                    type="number"
                                    size="small"
                                    value={numberOfColors}
                                    onChange={(event) => setNumberOfColors(event.target.value)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton
                                                onClick={getColorPalette}
                                                edge="end"
                                                sx={{
                                                    borderRadius: '4px', // Устанавливаем квадратные углы
                                                    backgroundColor: '#7D8AFA', // Цвет фона кнопки
                                                    '&:hover': {
                                                        backgroundColor: '#7D8AFA', // Цвет фона при наведении
                                                    },
                                                    '&:focus': {
                                                        backgroundColor: '#7D8AFA', // Цвет фона при фокусе
                                                    },
                                                    marginRight: '-14px'
                                                }}
                                            >
                                                <AutoFixHighIcon sx={{ color: 'white' }} />
                                            </IconButton>
                                        )
                                    }}
                                    sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&:hover fieldset': {
                                        borderColor: '#7D8AFA', 
                                        },
                                        '&.Mui-focused fieldset': {
                                        borderColor: '#7D8AFA',
                                        },
                                        width: '200px',
                                        },
                                    }}
                                />
                                <div className="palette">
                                    {paletteRGB.map((color, index) => (
                                        <div key={index} className="color">
                                            <div
                                                className="color-box"
                                                style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                                            />
                                            <span className="spanPal">
                                                #{color.r.toString(16)}{color.g.toString(16)}{color.b.toString(16)}
                                            </span>
                                            <IconButton onClick={() => handleColorRemoval(index)}>
                                                <ClearIcon sx={{ fontSize: 15 }}/>
                                            </IconButton>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SettingBlock>
                        <SettingBlock
                            key={3}
                            number={4}
                            header={'Генерация'} 
                            expandedHeight={'270px'} 
                            isFirst={false} isLast={true} 
                            onNext={handleNext} 
                            onPrev={handlePrev} 
                            isVisible={currentBlockIndex === 3}>
                            <div className="pic_cont">
                                <div className="subtitle_pic">Нажмите кнопку сгенерировать и дождитесь процесса генерации</div>
                                <button className="add_pic2" onClick={handleButtonClick3}>Сгенерировать</button>
                                <button className="add_pic2" onClick={reload}>Сбросить</button>
                                <button className="add_pic2" onClick={handleButtonClick3}>Сохранить</button>
                                <input type="range" min="1" max="100" step="1" value="40" id="darknessSlider" style={{display: "none"}}
                                    oninput="document.getElementById('darknessSliderNumber').innerHTML = this.value; var gray = Math.round(255 * (1 - this.value / 100)); document.getElementById('darknessSliderNumber').style.color = 'rgb('+gray+', '+gray+', '+gray+')';"></input>
  
                            </div>
                        </SettingBlock>

                    </div>
                    <div className="picture_block">
                        {selectedImage && (
                            <>
                                {currentBlockIndex === 0 ? (
                                    <div className="img_win">
                                        <img src={selectedImage} alt="" style={{ maxWidth: "100%", height: "100%", objectFit: "contain" }} />
                                    </div>
                                ) : currentBlockIndex === 1 ? (
                                    <div className="img_win">
                                        <Cropper
                                            image={selectedImage}
                                            crop={crop}
                                            zoom={zoom}
                                            rotation={rotation}
                                            onRotationChange={onRotationChange}
                                            aspect={orient === 'альбом' ? 3 / 2 : orient === 'квадрат' ? 1 : 2 / 3}
                                            onCropChange={onCropChange}
                                            onZoomChange={onZoomChange}
                                            onCropComplete={onCropComplete}
                                            style={{
                                                containerStyle: {
                                                    position: "relative",
                                                    width: "700px",
                                                    height: "700px",
                                                    backgroundColor: "#fff",
                                                },
                                                mediaStyle: {
                                                    position: "static",
                                                }
                                            }}
                                        />
                                    </div>
                                ) : currentBlockIndex === 2 ? (
                                    <div className="img_win" style={{ display: "flex", justifyContent: "center"}}>
                                        <img src={croppedImage} alt="" style={{ maxWidth: "100%", height: "100%", objectFit: "contain" }} onClick={handleImageClick} />
                                    </div>
                                ) : currentBlockIndex === 3 ? (
                                    <div>
                                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                                        {showCreatePic && <CreatePic selectedColors={paletteRGB} selectedImage={croppedImage} />}
                                    </div>
                                ) : (
                                    <div className="img_win">
                                        {/* Заглушка, если изображение не выбрано */}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}


export default Schema;