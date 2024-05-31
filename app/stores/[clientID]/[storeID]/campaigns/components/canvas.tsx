"use client";
import { Raleway } from "next/font/google";
import { useRef, useState, useEffect } from 'react';
import NextImage from 'next/image';

import { type CampaignsState, useCampaignsContext } from '../context/CampaignsContext';

const raleway = Raleway({ subsets: ["latin"] });

const SOCIAL_MEDIA_TEMPLATE_MAP = {
    'instagram': {
        path: '/campaigns/campaign-template-instagram.png',
        width: 1080,
        height: 1080,
        text: {
            relativeX: 0.5, // relative x-coord for text position
            relativeY: 0.33, // relative y-coord for text position
        }
    },
    'facebook': {
        path: '/campaigns/campaign-template-facebook.png',
        width: 940,
        height: 788,
        text: {
            relativeX: 0.5,
            relativeY: 0.33,
        }
    },
    'twitter': {
        path: '/campaigns/campaign-template-twitter.png',
        width: 1080,
        height: 1920,
        text: {
            relativeX: 0.5,
            relativeY: 0.35,
        }
    },
    'story': {
        path: '/campaigns/campaign-template-your-story.png',
        width: 1080,
        height: 1920,
        text: {
            relativeX: 0.5,
            relativeY: 0.35,
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
    font?: string,
) {
    ctx.font = font || `bold 20px Serif`;
    ctx.fillStyle = 'black';
    ctx.textAlign ='center';
    ctx.textBaseline = 'middle';

    const words = text.split(' ');
    const lines: string[] = [];
    let line: string = '';
    let word: string = '';
    for (let i=0; i<words.length; i++) {
        word = words[i];

        if (ctx.measureText(line + word).width < maxWidth) {
            line += word + ' ';
        } else {
            lines.push(line);
            line = word + ' ';
        }
    }
    lines.push(line);

    // move starting y coord up by half of lineheight for each line
    y = y - ((lines.length - 1) * lineHeight / 2)
    for (let i=0; i<lines.length; i++) {
        ctx.fillText(lines[i], x, y);
        y += lineHeight;
    }
}

function populateCanvas(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    title: string,
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
            title,
            canvasWidth * relativeX,
            canvasHeight * relativeY - canvasWidth * 0.24,
            canvasWidth * 0.90, // max width is canvas width less a 5% buffer on each side
            canvasWidth * 0.12, // TO DO: handle text size better
            `bold ${Math.round(canvasWidth * 0.10)}px ${raleway.style.fontFamily}`,
        );
        
        fillTextWithWrap(
            ctx,
            text,
            canvasWidth * relativeX,
            canvasHeight * relativeY,
            canvasWidth * 0.90, // max width is canvas width less a 5% buffer on each side
            canvasWidth * 0.07, // TO DO: handle text size better
            `bold ${Math.round(canvasWidth * 0.06)}px ${raleway.style.fontFamily}`,
        );
    }
}

export default function Canvas() {
    const { canvasRef, selectedSocial, title, text } = useCampaignsContext() as CampaignsState;
    const [imageProps, setImageProps] = useState<{
        path: string,
        width: number,
        height: number,
        text: {
            relativeX: number,
            relativeY: number,
        }
    }>(SOCIAL_MEDIA_TEMPLATE_MAP['instagram']);
    const imageRef = useRef<HTMLImageElement>(null);
    
    const drawImage = () => {
        const canvas = canvasRef.current;
        const imageSrc = imageRef.current?.src;

        if (canvas && imageSrc) {
            const image = new Image();
            image.onload = function () {
                populateCanvas(
                    canvas,
                    image,
                    title,
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
        // Redraw canvas when image changes
        setImageProps(SOCIAL_MEDIA_TEMPLATE_MAP[selectedSocial]);
        drawImage();
    }, [selectedSocial, setImageProps, drawImage]);

    return (
        <>
            <div className='grid place-items-center' style={{ height: 360, width: '100%' }}>
                <canvas
                    ref={canvasRef}
                    width={SOCIAL_MEDIA_TEMPLATE_MAP[selectedSocial].width}
                    height={SOCIAL_MEDIA_TEMPLATE_MAP[selectedSocial].height}
                    className='border border-neutral-200'
                    style={{ height: 360, maxWidth: 360 }}
                />
            </div>

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