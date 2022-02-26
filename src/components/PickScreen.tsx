import React, { useState, useRef, useLayoutEffect } from "react";
import Grid from '@mui/material/Grid';
import Button from "./Button";

type Size = {
    width:number,
    height:number
}
type Point = {
    x: number,
    y: number,
    isTop: boolean
}

function PickScreen() {
    const [ defaultImage, setDefaultImage ] = useState<string>("");
    const [ points, setPoints ] = useState<Array<Point>>([]);
    const [ startPoints, setStartPoints ] = useState<number>(-1); 
    const [ canvasSize, setCanvasSize ] = useState<Size>({
        width: 0,
        height: 0
    });

    const refHiddenInputFile = useRef<HTMLInputElement>(null);
    const refHiddenImg = useRef<HTMLImageElement>(null);
    const refHiddenAnchor = useRef<HTMLAnchorElement>(null);
    const refCanvas = useRef<HTMLCanvasElement>(null);

    useLayoutEffect(() => {
        if (defaultImage === "") {
            if (refHiddenInputFile && refHiddenInputFile.current) {
                refHiddenInputFile.current.click();
            }
        } else {
            const img = refHiddenImg.current;
            const canvas = refCanvas.current;

            if (img && canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
                    drawPoints();
                }
            }
        }
    });

    function handleInputFileChange():void {
        if (refHiddenInputFile.current && refHiddenInputFile.current.files) { 
            const newImage:string = URL.createObjectURL(refHiddenInputFile.current.files[0]);
            setDefaultImage(newImage);
            
            if (startPoints === -1) {
                let startHolds:number = -1;
                do {
                    const input:string | null = prompt("시작 홀드 수를 입력해주세요 (1-4)", "1");
                    if (input) {
                        startHolds = parseInt(input);
                    }
                } while(startHolds < 1 || startHolds > 4);
                setStartPoints(startHolds);
            }
        }
    }

    function updateCanvas():void {
        if (canvasSize.width !== 0 && canvasSize.height !== 0) return;

        const selectedImg = refHiddenImg.current;
        if (selectedImg) {
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
    }

    function addHold(event:React.MouseEvent<HTMLCanvasElement, MouseEvent>, isTop:boolean = false):void {
        const canvas = refCanvas.current;
        if (canvas) {
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
    }

    function drawPoints():void {
        const canvas = refCanvas.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
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
        }
    }

    function undo():void {
        setPoints((prevPoints) => {
            const lastIndex:number = prevPoints.length - 1;

            return prevPoints.filter((point, index) => {
                return index !== lastIndex;
            });
        });
    }

    function reset():void {
        setPoints([]);
    }

    function recapture():void {
        setPoints([]);
        setStartPoints(-1);
        setDefaultImage("");
        setCanvasSize({
            width: 0,
            height: 0
        });
    }

    function save():void {
        if (refCanvas.current && refHiddenAnchor.current) {
            const data = refCanvas.current.toDataURL('image/png');
            const anchor = refHiddenAnchor.current;
            anchor.href = data.replace(/^data:image\/[^;]/, 'data:application/octet-stream');
            anchor.click();
        }
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
                            onClick={(event) => {
                                addHold(event);
                            }}
                            onDoubleClick={(event:React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
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
                capture="environment" 
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