/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useEffect } from 'react';
import { CaretLeftOutlined } from '@ant-design/icons';
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
                className="right-bottom"
                onMouseDown={handleMouseDown(Direction.BottomRight)}
            >
                <CaretLeftOutlined rotate={45} />
            </div>
        </>
    );
};

export default Resizer;
