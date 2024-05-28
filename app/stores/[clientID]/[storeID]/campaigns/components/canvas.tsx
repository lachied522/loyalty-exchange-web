"use client";
import { useRef, useState, useEffect } from 'react';
import NextImage from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { type CampaignsState, useCampaignsContext } from '../context/CampaignsContext';

const SOCIAL_MEDIA_TEMPLATE_MAP = {
    'instagram': {
        path: '/campaigns/campaign-template-instagram.png',
        width: 1080,
        height: 1080,
        text: {
            relativeX: 0.5, // relative x-coord for text position
            relativeY: 0.3, // relative y-coord for text position
        }
    },
    'facebook': {
        path: '/campaigns/campaign-template-facebook.png',
        width: 940,
        height: 788,
        text: {
            relativeX: 0.5,
            relativeY: 0.3,
        }
    },
    'twitter': {
        path: '/campaigns/campaign-template-twitter.png',
        width: 1080,
        height: 1920,
        text: {
            relativeX: 0.5,
            relativeY: 0.33,
        }
    },
    'story': {
        path: '/campaigns/campaign-template-your-story.png',
        width: 1080,
        height: 1920,
        text: {
            relativeX: 0.5,
            relativeY: 0.33,
        }
    },
}

function fillTextWithWrap(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    fontSize: number,
) {
    fontSize = Math.round(fontSize);
    ctx.font = `bold ${fontSize}px Serif`;
    ctx.fillStyle = 'black';
    ctx.textAlign ='center';
    ctx.textBaseline = 'middle';

    const words = text.split(' ');
    let line: string = '';
    let word: string = '';
    for (let i=0; i<words.length; i++) {
        word = words[i];

        if (ctx.measureText(line + word).width < maxWidth) {
            line += word + ' ';
        } else {
            ctx.fillText(line, x, y);
            y += lineHeight;
            line = word + ' ';
        }
    }
    ctx.fillText(line, x, y);
}

function populateCanvas(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    text: string,
    relativeX: number, 
    relativeY: number,
) {
    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    if (ctx) {
        // clear canvas before drawing new image
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        
        fillTextWithWrap(
            ctx,
            text,
            canvasWidth * relativeX,
            canvasHeight * relativeY,
            canvasWidth * 0.90, // max width is canvas width less a 10px buffer
            canvasHeight * 0.06,
            canvasHeight * 0.05,
        );
    }
}

export default function Canvas() {
    const { selectedSocial } = useCampaignsContext() as CampaignsState;
    const [imageProps, setImageProps] = useState<{
        path: string,
        width: number,
        height: number,
        text: {
            relativeX: number,
            relativeY: number,
        }
    }>(SOCIAL_MEDIA_TEMPLATE_MAP['instagram']);
    const [text, setText] = useState<string>('Our rewards are here! Download now.');
    const imageRef = useRef<HTMLImageElement>(null);
    const downloadCanvasRef = useRef<HTMLCanvasElement>(null); // full-size canvas to download in high res
    const displayCanvasRef = useRef<HTMLCanvasElement>(null); // canvas to display on screen
  
    const drawImage = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const imageSrc = imageRef.current?.src;

        if (canvas && imageSrc) {
            const image = new Image();
            image.onload = function () {
                populateCanvas(
                    canvas,
                    image,
                    text,
                    imageProps.text.relativeX,
                    imageProps.text.relativeY,
                )
            }
            image.crossOrigin = "anonymous"; // allow cross origin images
            image.src = imageSrc;
        }
    }

    useEffect(() => {
        setImageProps(SOCIAL_MEDIA_TEMPLATE_MAP[selectedSocial]);
        // Redraw canvas when image changes
        drawImage(displayCanvasRef);
        drawImage(downloadCanvasRef);
    }, [selectedSocial, setImageProps, drawImage]);
  
    const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
        // Redraw canvas when text changes
        drawImage(displayCanvasRef);
        drawImage(downloadCanvasRef);
    };
  
    const downloadImage = () => {
        const canvas = downloadCanvasRef.current;
        if (canvas) {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'my-campaign.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <>
            <div className='flex flex-col gap-2'>
                <canvas
                    ref={displayCanvasRef}
                    width={360}
                    height={SOCIAL_MEDIA_TEMPLATE_MAP[selectedSocial].height * 360 / SOCIAL_MEDIA_TEMPLATE_MAP[selectedSocial].width}
                    className='border border-neutral-200'
                />

                <Input
                    type="text"
                    placeholder='Our rewards are here! Download now.'
                    maxLength={64}
                    value={text}
                    onChange={handleTextChange}
                />
                <Button onClick={downloadImage}>Download</Button>
            </div>
            
            <canvas
                ref={downloadCanvasRef}
                width={SOCIAL_MEDIA_TEMPLATE_MAP[selectedSocial].width}
                height={SOCIAL_MEDIA_TEMPLATE_MAP[selectedSocial].height}
                className='hidden'
            />

            <NextImage
                ref={imageRef}
                alt=''
                placeholder='empty'
                src={imageProps.path}
                width={imageProps.width}
                height={imageProps.height}
                className='hidden'
            />
        </>
    );
}