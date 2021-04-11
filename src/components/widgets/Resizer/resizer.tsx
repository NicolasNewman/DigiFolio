/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import { Direction } from './Direction';

const Resizer = ({ onResize }) => {
    const [direction, setDirection] = useState('');
    const [mouseDown, setMouseDown] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!direction) return;

            onResize(direction, e.movementX, e.movementY);
        };

        if (mouseDown) {
            window.addEventListener('mousemove', handleMouseMove);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [mouseDown, direction, onResize]);

    useEffect(() => {
        const handleMouseUp = () => setMouseDown(false);

        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleMouseDown = (direction: React.SetStateAction<string>) => () => {
        setDirection(direction);
        setMouseDown(true);
    };

    return (
        <>
            <div
                className="top-left"
                onMouseDown={handleMouseDown(Direction.TopLeft)}
            />

            <div className="top" onMouseDown={handleMouseDown(Direction.Top)} />

            <div
                className="top-right"
                onMouseDown={handleMouseDown(Direction.TopRight)}
            />

            <div
                className="right"
                onMouseDown={handleMouseDown(Direction.Right)}
            />

            <div
                className="right-bottom"
                onMouseDown={handleMouseDown(Direction.BottomRight)}
            />

            <div
                className="bottom"
                onMouseDown={handleMouseDown(Direction.Bottom)}
            />

            <div
                className="bottom-left"
                onMouseDown={handleMouseDown(Direction.BottomLeft)}
            />

            <div
                className="left"
                onMouseDown={handleMouseDown(Direction.Left)}
            />
        </>
    );
};

export default Resizer;
