import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import Button from './Button';

type Size = {
  width: number;
  height: number;
};
type Point = {
  x: number;
  y: number;
  isTop: boolean;
};

function PickScreen() {
  const [defaultImage, setDefaultImage] = useState<string>('');
  const [points, setPoints] = useState<Array<Point>>([]);
  const [startPoints, setStartPoints] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [canvasSize, setCanvasSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  const refHiddenInputFile = useRef<HTMLInputElement>(null);
  const refHiddenImg = useRef<HTMLImageElement>(null);
  const refHiddenAnchor = useRef<HTMLAnchorElement>(null);
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    if (defaultImage === '') {
      if (refHiddenInputFile && refHiddenInputFile.current) {
        refHiddenInputFile.current.click();
      }
      return;
    }

    const img = refHiddenImg.current;
    const canvas = refCanvas.current;

    if (img && canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvasSize.width, canvasSize.height);
        drawPoints();
      }
    }
  });

  const handleInputFileChange = useCallback((): void => {
    if (refHiddenInputFile.current && refHiddenInputFile.current.files) {
      const newImage: string = URL.createObjectURL(
        refHiddenInputFile.current.files[0]
      );
      setDefaultImage(newImage);

      if (startPoints === -1) {
        let startHolds: number = -1;
        do {
          const input: string | null = prompt(
            '시작 홀드 수를 입력해주세요 (1-4)',
            '1'
          );
          if (input) {
            startHolds = parseInt(input);
          }
        } while (startHolds < 1 || startHolds > 4);
        setStartPoints(startHolds);
        setIsLoading(false);
      }
    }
  }, []);

  const updateCanvas = useCallback((): void => {
    if (canvasSize.width !== 0 && canvasSize.height !== 0) return;

    const selectedImg = refHiddenImg.current;
    if (selectedImg) {
      const windowWidth = window.innerWidth * 0.9;
      const windowHeight = window.innerHeight * 0.7;

      // 이미지 비율 유지하면서 화면에 맞게 크기 조정
      const imgRatio = selectedImg.width / selectedImg.height;
      const windowRatio = windowWidth / windowHeight;

      let width, height;

      if (imgRatio > windowRatio) {
        // 이미지가 더 가로로 긴 경우, 너비를 기준으로 조정
        width = Math.min(selectedImg.width, windowWidth);
        height = width / imgRatio;
      } else {
        // 이미지가 더 세로로 긴 경우, 높이를 기준으로 조정
        height = Math.min(selectedImg.height, windowHeight);
        width = height * imgRatio;
      }

      setCanvasSize({ width, height });
    }
  }, []);

  const addHold = useCallback(
    (
      event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
      isTop: boolean = false
    ): void => {
      const canvas = refCanvas.current;
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const newPoint = { x: x, y: y, isTop: isTop };

        setPoints(prevPoints => {
          if (isTop) {
            // remove previous point
            const newPoints = prevPoints.slice(0, prevPoints.length - 2);
            return [...newPoints, newPoint];
          } else {
            return [...prevPoints, newPoint];
          }
        });
      }
    },
    []
  );

  const drawPoints = useCallback((): void => {
    const canvas = refCanvas.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const markerSize =
          rect.width > rect.height ? rect.width * 0.06 : rect.height * 0.06;
        const radius = markerSize * 0.4;
        const endAngle = 2 * Math.PI;

        points.map(
          (point: { x: number; y: number; isTop: any }, index: number) => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, radius, 0, endAngle, false);
            ctx.lineWidth = markerSize * 0.15;
            ctx.strokeStyle = 'white';
            ctx.stroke();

            if (point.isTop) {
              ctx.strokeStyle = 'rgb(0, 85, 255)';
            } else if (index < startPoints) {
              ctx.strokeStyle = 'red';
            } else {
              ctx.strokeStyle = 'springgreen';
            }

            ctx.arc(point.x, point.y, radius, 0, endAngle, false);
            ctx.lineWidth = markerSize * 0.1;
            ctx.stroke();
          }
        );
      }
    }
  }, [points]);

  const undo = useCallback((): void => {
    setPoints(prevPoints => {
      const lastIndex: number = prevPoints.length - 1;

      return prevPoints.filter((point, index) => {
        return index !== lastIndex;
      });
    });
  }, []);

  const reset = useCallback((): void => {
    setPoints([]);
  }, []);

  const recapture = useCallback((): void => {
    setPoints([]);
    setStartPoints(-1);
    setDefaultImage('');
    setIsLoading(true);
    setCanvasSize({
      width: 0,
      height: 0,
    });
  }, []);

  const save = useCallback((): void => {
    if (refCanvas.current && refHiddenAnchor.current) {
      const data = refCanvas.current.toDataURL('image/png');
      const anchor = refHiddenAnchor.current;
      anchor.href = data.replace(
        /^data:image\/[^;]/,
        'data:application/octet-stream'
      );
      anchor.click();
    }
  }, []);

  return (
    <div className="p-4">
      {isLoading && (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      )}

      {defaultImage !== null && !isLoading && (
        <div className="space-y-6">
          <div className="flex justify-center">
            <canvas
              className="disable-dbl-tap-zoom canvas-style"
              width={canvasSize.width}
              height={canvasSize.height}
              onClick={event => {
                addHold(event);
              }}
              onDoubleClick={(
                event: React.MouseEvent<HTMLCanvasElement, MouseEvent>
              ) => {
                addHold(event, true);
              }}
              ref={refCanvas}
            />
          </div>
          <div className="flex justify-center space-x-4">
            <Button imgSrc="img/grin.png" name="undo" onClick={undo} />
            <Button imgSrc="img/sparkle.png" name="reset" onClick={reset} />
            <Button
              imgSrc="img/camera.png"
              name="recapture"
              onClick={recapture}
            />
            <Button imgSrc="img/disk.png" name="save" onClick={save} />
          </div>
        </div>
      )}

      <img
        src={defaultImage}
        className="hidden"
        onLoad={updateCanvas}
        ref={refHiddenImg}
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleInputFileChange}
        ref={refHiddenInputFile}
      />
      <a className="hidden" download="image.png" ref={refHiddenAnchor}></a>
    </div>
  );
}

export default PickScreen;
