import React, { useState, useRef, useLayoutEffect } from "react";
import Grid from '@mui/material/Grid';
import Button from "./Button";

function PickScreen() {
    const [ defaultImage, setDefaultImage ] = useState(null);
    const [ points, setPoints ] = useState([]);
    const [ startPoints, setStartPoints ] = useState(-1); 
    const [ canvasSize, setCanvasSize ] = useState({
        width: 0,
        height: 0
    });

    const refHiddenInputFile = useRef(null);
    const refHiddenImg = useRef(null);
    const refHiddenAnchor = useRef(null);
    const refCanvas = useRef(null);

    useLayoutEffect(() => {
        if (defaultImage === null) {
            if (refHiddenInputFile && refHiddenInputFile.current) {
                refHiddenInputFile.current.click();
            }
        } else {
            const img = refHiddenImg.current;
            const canvas = refCanvas.current;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
            drawPoints();
        }
    });

    function handleInputFileChange() {
        const newImage = URL.createObjectURL(refHiddenInputFile.current.files[0]);
        setDefaultImage(newImage);
        
        if (startPoints === -1) {
            let input = -1;
            do {
                input = prompt("시작 홀드 수를 입력해주세요 (1-4)", 1);
            } while(input < 1 || input > 4);
            setStartPoints(input);
        }
    }

    function updateCanvas() {
        if (canvasSize.width !== 0 && canvasSize.height !== 0) return;
        
        const selectedImg = refHiddenImg.current;
        const windowWidth = (window.innerWidth * 0.9);
        let nRatio = 1;
        
        if (selectedImg.width > windowWidth) {
            nRatio = selectedImg.width / windowWidth;
        } else {
            nRatio = windowWidth / selectedImg.width;
        }

        selectedImg.width /= nRatio;
        selectedImg.height /= nRatio;

        setCanvasSize({
            width: selectedImg.width,
            height: selectedImg.height
        });
    }

    function addHold(event, isTop) {
        if (isTop == null) isTop = false;

        const canvas = refCanvas.current;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const newPoint = { x: x, y: y, isTop: isTop };

        setPoints((prevPoints) => {
            if (isTop) {
                // remove previous point
                const newPoints = prevPoints.slice(0, prevPoints.length - 2);
                return [...newPoints, newPoint];
            } else {
                return [...prevPoints, newPoint];
            }
        });
    }

    function drawPoints() {
        const canvas = refCanvas.current;
        const ctx = canvas.getContext("2d");

        const rect = canvas.getBoundingClientRect();
        const markerSize = (rect.width > rect.height) ? rect.width*0.06 : rect.height*0.06;
        const radius = markerSize * 0.4;
        const endAngle = 2*Math.PI;

        points.map((point, index) => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, radius, 0, endAngle, false);
            ctx.lineWidth = markerSize * 0.15;
            ctx.strokeStyle = "white";
            ctx.stroke();
    
            if (point.isTop) {
                ctx.strokeStyle = "rgb(0, 85, 255)";
            } else if (index < startPoints) {
                ctx.strokeStyle = "red";
            } else {
                ctx.strokeStyle = "springgreen";
            }
    
            ctx.arc(point.x, point.y, radius, 0, endAngle, false);
            ctx.lineWidth = markerSize * 0.1;
            ctx.stroke();
        });
    }

    function undo() {
        setPoints((prevPoints) => {
            const lastIndex = prevPoints.length - 1;

            return prevPoints.filter((point, index) => {
                return index !== lastIndex;
            });
        });
    }

    function reset() {
        setPoints([]);
    }

    function recapture() {
        setPoints([]);
        setStartPoints(-1);
        setDefaultImage(null);
        setCanvasSize({
            width: 0,
            height: 0
        });
    }

    function save() {
        const data = refCanvas.current.toDataURL('image/png');
        const anchor = refHiddenAnchor.current;
        anchor.href = data.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        anchor.click();
    }

    return (
        <Grid>
            {defaultImage !== null &&
                <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={12}>
                        <canvas 
                            className="disable-dbl-tap-zoom"
                            width={canvasSize.width} 
                            height={canvasSize.height}
                            onClick={addHold}
                            onDoubleClick={(event) => {
                                addHold(event, true);
                            }}
                            ref={refCanvas}
                        />
                    </Grid>
                    <Button imgSrc="img/grin.png" name="undo" onClick={undo}/>
                    <Button imgSrc="img/sparkle.png" name="reset" onClick={reset}/>
                    <Button imgSrc="img/camera.png" name="recapture" onClick={recapture}/>
                    <Button imgSrc="img/disk.png" name="save" onClick={save}/>
                </Grid>
            }
            <img 
                src={defaultImage}
                style={{ display: "none" }}
                onLoad={updateCanvas}
                ref={refHiddenImg}
            />
            <input 
                type="file" 
                accept="image/*" 
                capture="camera" 
                style={{ display: "none" }}
                onChange={handleInputFileChange}
                ref={refHiddenInputFile}
            />
            <a 
                style={{ display: "none" }} 
                download="image.png"
                ref={refHiddenAnchor}
            ></a>
        </Grid>
    );
}

export default PickScreen;