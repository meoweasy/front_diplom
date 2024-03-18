import React, { useState, useEffect, useRef  } from 'react';


const CreatePic = ({ selectedColors, selectedImage }) => {
    const canvasRef = useRef(null);
    const outlineCanvasRef = useRef(null);
    const [status, setStatus] = useState('');
    const [isReady, setIsReady] = useState(false);
    const imgRef = useRef(null);
    const [currentImage, setCurrentImage] = useState(null);

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
                    <button onClick={() => handleImageChange(canvasRef)}>Раскрашенная схема</button>
                    <button onClick={() => handleImageChange(outlineCanvasRef)}>Схема</button>
                </div>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <canvas ref={outlineCanvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default CreatePic;