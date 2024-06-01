import React from "react";
import Icons from "./static";

export function renderStaticIcon({
    name,
    size = 24,
    color = 'black',
} :{
    name: string | null
    size?: number,
    color?: string
}) {
    if (name && name in Icons) {
        return React.createElement(Icons[name as keyof typeof Icons], { size, color });
    }
    return React.createElement(Icons['PartyPopper'], { size, color });
}
