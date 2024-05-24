"use client";
import { useRef, useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';

function populateCanvas(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    text: string
) {
    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    if (ctx) {
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign ='center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
    }
}

interface CanvasProps {
    text: string,
    imageURL: File
}

export default function Canvas() {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [text, setText] = useState<string>('');
    const canvasRef = useRef<HTMLCanvasElement>(null);
  
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files ? event.target.files[0] : null;
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const src = e.target!.result as string;
          setImageSrc(src);
        };
        reader.readAsDataURL(file);
      }
    };
  
    const drawImage = () => {
        const canvas = canvasRef.current;
        if (canvas && imageSrc) {
            const img = new Image();
            img.src = imageSrc;

            populateCanvas(
                canvas,
                img,
                text
            )
        }
    };
  
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        drawImage(); // Redraw the image with updated text whenever the text changes
    };
  
    const downloadImage = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'edited-image.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                height={240}
                width={360}
                className='border border-neutral-400'
            />
            
            <input type="file" onChange={handleImageChange} accept="image/*" />
            <input type="text" value={text} onChange={handleTextChange} />
            <Button onClick={downloadImage}>Download</Button>
        </div>
    );
}