import React, {useState, useEffect} from "react";
import '../styles/schema.scss';
import SettingBlock from "../components/settingBlock";
import Cropper from 'react-easy-crop';
import { getOrientation } from "get-orientation";
import { getCroppedImg } from '../utils/canvasUtils';


const Schema = () => {
    const [selectedImage, setImageSrc] = useState(null);
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
    const [orient, setOrient] = useState('книжная');
    const [format, setFormat] = useState('');
    const [selectedColors, setSelectedColors] = useState([]);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [croppedImage, setCroppedImage] = useState(null);


    useEffect(() => {
        const showCroppedImage = async () => {
            if (currentBlockIndex === 2 && selectedImage && croppedAreaPixels) {
                try {
                    const croppedImage = await getCroppedImg(selectedImage, croppedAreaPixels);
                    console.log('donee', { croppedImage });
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
   
    const handleOrientationChange = (event) => {
        setOrient(event.target.value);
    };

    const handleFormatChange = (event) => {
        setFormat(event.target.value);
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

        setSelectedColors(prevColors => [...prevColors, color]);
    };

    const onCropChange = crop => {
        setCrop(crop);
    };

    const onZoomChange = zoom => {
        setZoom(zoom);
    };

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    };


    const onFileChange = async (e) => {
        if (e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0]
          let imageDataUrl = await readFile(file)
    
          try {
            // apply rotation if needed
            const orientation = await getOrientation(file)
            const rotation = ORIENTATION_TO_ANGLE[orientation]
            if (rotation) {
              imageDataUrl = await getRotatedImage(imageDataUrl, rotation)
            }
          } catch (e) {
            console.warn('failed to detect the orientation')
          }
    
          setImageSrc(imageDataUrl)
        }
    }
    
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
                                <div className="subtitle_pic">Выберите нужный формат изображения и осуществите подгонку фото под изображение, затем обязательно нажмите кнопку "Применить" на фото</div>
                                <div className="orient_text">Выберите ориентацию</div>
                                <div className="check_orient">
                                    <div className="radio_cast">
                                        <input
                                            type="radio"
                                            id="alb"
                                            value="альбомная"
                                            checked={orient === 'альбомная'}
                                            onChange={handleOrientationChange}
                                        />
                                        <label htmlFor="alb" className="orient_label">альбомная</label>
                                    </div>
                                    <div className="radio_cast">
                                        <input
                                            type="radio"
                                            id="kn"
                                            value="книжная"
                                            checked={orient === 'книжная'}
                                            onChange={handleOrientationChange}
                                        />
                                        <label htmlFor="kn" className="orient_label">книжная</label>
                                    </div>
                                </div>
                                <div className="form_text">Выберите формат</div>
                                <div className="check_form">
                                    <div className="radio_cast">
                                        <input
                                            type="radio"
                                            id="A3"
                                            value="A3"
                                            checked={format === 'A3'}
                                            onChange={handleFormatChange}
                                        />
                                        <label htmlFor="A3" className="orient_label">A3</label>
                                    </div>
                                    <div className="radio_cast">
                                        <input
                                            type="radio"
                                            id="A4"
                                            value="A4"
                                            checked={format === 'A4'}
                                            onChange={handleFormatChange}
                                        />
                                        <label htmlFor="A4" className="orient_label">A4</label>
                                    </div>
                                    <div className="radio_cast">
                                        <input
                                            type="radio"
                                            id="A5"
                                            value="A5"
                                            checked={format === 'A5'}
                                            onChange={handleFormatChange}
                                        />
                                        <label htmlFor="A5" className="orient_label">A5</label>
                                    </div>
                                </div>
                            </div>
                        </SettingBlock>
                        <SettingBlock
                            key={2}
                            number={3}
                            header={'Палитра'} 
                            expandedHeight={'200px'} 
                            isFirst={false}
                            isLast={true} 
                            onNext={handleNext} 
                            onPrev={handlePrev} 
                            isVisible={currentBlockIndex === 2}>
                            <div className="pic_cont">
                                <div className="subtitle_pic">Щелкните по точкам на изображении, чтобы выбрать цветовую палитру</div>
                                <div className="palette">
                                    {selectedColors.map((color, index) => (
                                        <div
                                            key={index}
                                            className="color_box"
                                            style={{ backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})` }}
                                        >
                                            HEX: #{color.r.toString(16)}{color.g.toString(16)}{color.b.toString(16)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </SettingBlock>

                    </div>
                    <div className="picture_block">
                        {selectedImage && (
                            <>
                                {currentBlockIndex === 0 ? (
                                    <div className="img_win">
                                        <img src={selectedImage} alt="" style={{ maxWidth: "100%", height: "auto" }} />
                                    </div>
                                ) : currentBlockIndex === 1 ? (
                                    <div className="img_win">
                                        <Cropper
                                            image={selectedImage}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={orient === 'альбомная' ? 3 / 2 : 2 / 3}
                                            onCropChange={onCropChange}
                                            onZoomChange={onZoomChange}
                                            onCropComplete={onCropComplete}
                                            style={{
                                                containerStyle: {
                                                    position: "relative",
                                                    width: "850px",
                                                    height: "850px",
                                                    backgroundColor: "#fff",
                                                },
                                                mediaStyle: {
                                                    position: "static",
                                                }
                                            }}
                                        />
                                    </div>
                                ) : currentBlockIndex === 2 ? (
                                    <div className="img_win">
                                        <img src={croppedImage} alt="" style={{ maxWidth: "100%", height: "100%", objectFit: "contain" }} onClick={handleImageClick} />
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

function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }

export default Schema;