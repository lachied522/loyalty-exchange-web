"use client";
import { Raleway } from "next/font/google";
import { useRef, useState, useEffect } from 'react';
import NextImage from 'next/image';

import { type CampaignsState, useCampaignsContext } from '../context/CampaignsContext';
import { LoaderCircle } from "lucide-react";

const raleway = Raleway({ subsets: ["latin"] });

type TextProps = {
    content: string,
    x: number, // x-coord for center of text on canvas
    y: number, // y-coord for center of text on canvas
    lineHeight: number, // line height
    font: string, // CSS font, e.g. bold 64px Raleway
}

const SOCIAL_MEDIA_TEMPLATE_MAP = {
    instagram: {
        path: '/campaigns/campaign-template-instagram.png',
        width: 1080,
        height: 1080,
        title: {
            x: 540,
            y: 130,
            lineHeight: 130,
            font: `bold 100px ${raleway.style.fontFamily}`
        },
        body: {
            x: 540,
            y: 350,
            lineHeight: 75,
            font: `bold 64px ${raleway.style.fontFamily}`
        }
    },
    facebook: {
        path: '/campaigns/campaign-template-facebook.png',
        width: 940,
        height: 788,
        title: {
            x: 470,
            y: 100,
            lineHeight: 120,
            font: `bold 80px ${raleway.style.fontFamily}`
        },
        body: {
            x: 470,
            y: 275,
            lineHeight: 60,
            font: `bold 56px ${raleway.style.fontFamily}`
        }
    },
    twitter: {
        path: '/campaigns/campaign-template-twitter.png',
        width: 1080,
        height: 1920,
        title: {
            x: 540,
            y: 200,
            lineHeight: 130,
            font: `bold 100px ${raleway.style.fontFamily}`
        },
        body: {
            x: 540,
            y: 540,
            lineHeight: 75,
            font: `bold 64px ${raleway.style.fontFamily}`
        }
    },
    story: {
        path: '/campaigns/campaign-template-your-story.png',
        width: 1080,
        height: 1920,
        title: {
            x: 540,
            y: 200,
            lineHeight: 130,
            font: `bold 100px ${raleway.style.fontFamily}`
        },
        body: {
            x: 540,
            y: 540,
            lineHeight: 75,
            font: `bold 64px ${raleway.style.fontFamily}`
        }
    }
}

function fillTextWithFixedWidth(
    ctx: CanvasRenderingContext2D,
    text: TextProps,
    maxWidth: number,
) {
    // dynamically adjust fontsize to fit text inside maxWidth
    let [fontWeight, fontSizeString, fontFamily, fontFamilyFallback] = text.font.split(' ');

    let fontSize = (() => {
        const match = fontSizeString.match(/(\d+)px/);
        if (match) return Number(match[1]);
        return 100;
    })();

    // create temporary context element to measure text width
    const _ctx = document.createElement('canvas').getContext('2d');
    if (_ctx) {
        _ctx.font = text.font;
        let adjustedFontSize = fontSize / Math.max(_ctx!.measureText(text.content).width / maxWidth, 1);
        ctx.font = `${fontWeight} ${adjustedFontSize}px ${fontFamily} ${fontFamilyFallback}`;
    } else {
        ctx.font = text.font;
    }
    
    ctx.fillStyle = 'black';
    ctx.textAlign ='center';
    ctx.textBaseline = 'middle';

    ctx.fillText(text.content, text.x, text.y);
}

function fillTextWithWrap(
    ctx: CanvasRenderingContext2D,
    text: TextProps,
    maxWidth: number,
) {
    ctx.font = text.font;
    ctx.fillStyle = 'black';
    ctx.textAlign ='center';
    ctx.textBaseline = 'middle';

    const words = text.content.split(' ');
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
    let y = text.y - ((lines.length - 1) * text.lineHeight / 2);
    for (let i=0; i<lines.length; i++) {
        ctx.fillText(lines[i], text.x, y);
        y += text.lineHeight;
    }
}

function populateCanvas(
    canvas: HTMLCanvasElement,
    image: HTMLImageElement,
    title: TextProps,
    body: TextProps,
) {
    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    if (ctx) {
        // clear canvas before drawing new image
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.drawImage(image, 0, 0, canvasWidth, canvasHeight);
        fillTextWithFixedWidth(
            ctx,
            title,
            canvasWidth * 0.90, // max width is canvas width less a 5% buffer on each side
        );
        fillTextWithWrap(
            ctx,
            body,
            canvasWidth * 0.90, // max width is canvas width less a 5% buffer on each side
        );
    }
}

export default function Canvas() {
    const { canvasRef, selectedSocial, title, body, isLoading, setIsLoading } = useCampaignsContext() as CampaignsState;
    const [templateProps, setTemplateProps] = useState(SOCIAL_MEDIA_TEMPLATE_MAP['instagram']);
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
                    { content: title, ...templateProps.title },
                    { content: body, ...templateProps.body },
                )
                setIsLoading(false);
            }
            image.crossOrigin = "anonymous"; // allow cross origin images
            image.src = imageSrc;
        }
    }

    useEffect(() => {
        // Redraw canvas when image changes
        setIsLoading(true);
        setTemplateProps(SOCIAL_MEDIA_TEMPLATE_MAP[selectedSocial]);
        drawImage();
    }, [selectedSocial, setIsLoading, setTemplateProps, drawImage]);

    return (
        <>
            <div className='grid place-items-center' style={{ height: templateProps.height > 1080? 540: 360, width: '100%' }}>
                {isLoading && (
                <div className='animate-spin'>
                    <LoaderCircle size={32} color='lightgray' />
                </div>
                )}
                <canvas
                    ref={canvasRef}
                    width={templateProps.width}
                    height={templateProps.height}
                    className='border border-neutral-200'
                    style={{ height: templateProps.height > 1080? 540: 360, display: isLoading? 'none': 'block' }}
                />
            </div>

            <NextImage
                ref={imageRef}
                alt=''
                placeholder='empty'
                src={templateProps.path}
                width={templateProps.width}
                height={templateProps.height}
                className='hidden'
            />
        </>
    );
}