import React, { useState, useEffect } from 'react';
import './color.css';
import axios from 'axios';
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import { FcUndo } from "react-icons/fc";

const ColorPalette = () => {
    const [colors, setColors] = useState([]);
    const [newColor, setNewColor] = useState('');
    const [colorName, setColorName] = useState('');
    const [colorCategory, setColorCategory] = useState('');
    const [copiedColor, setCopiedColor] = useState('');
    const [editingColor, setEditingColor] = useState(null);
    const [editColorValue, setEditColorValue] = useState('');
    const [deletedColor, setDeletedColor] = useState(null);

    useEffect(() => {
        fetchColors();
    }, []);

    const fetchColors = async () => {
        try {
            const response = await axios.get('https://color-api-xgao.onrender.com/colors?sortByCategory=true');
            setColors(response.data);
        } catch (error) {
            handleError(error);
        }
    };

    const addColor = async () => {
        try {
            const colorToAdd = newColor.startsWith('#') ? newColor : `#${newColor}`;
            await axios.post('https://color-api-xgao.onrender.com/colors', {
                color: colorToAdd,
                name: colorName,
                category: colorCategory,
            });
            fetchColors();
            setNewColor('');
            setColorName('');
            setColorCategory('');
            setCopiedColor('');
        } catch (error) {
            handleError(error);
        }
    };

    const editColor = (color) => {
        setEditingColor(color);
        setEditColorValue(color.color);
        setColorName(color.name || '');
        setColorCategory(color.category || '');
    };

    const updateColor = async () => {
    try {
        const colorToUpdate = editColorValue.startsWith('#') ? editColorValue : `#${editColorValue}`;
        const response = await axios.put(
            `https://color-api-xgao.onrender.com/colors/${editingColor._id}`,
            {
                color: colorToUpdate,
                name: colorName,
                category: colorCategory,
            }
        );
        fetchColors();
        setEditingColor(null); // Reset editingColor state
        setEditColorValue('');
        setCopiedColor('');
    } catch (error) {
        handleError(error);
    }
};


    const deleteColor = async (color) => {
    try {
        setDeletedColor(color);
        await axios.delete(`https://color-api-xgao.onrender.com/colors/${color._id}`);
        fetchColors();
    } catch (error) {
        handleError(error);
    }
};


    const undoDelete = async () => {
        try {
            if (deletedColor) {
                await axios.post('https://color-api-xgao.onrender.com/colors', deletedColor);
                fetchColors();
                setDeletedColor(null);
            }
        } catch (error) {
            handleError(error);
        }
    };

    const copyColorCode = (color) => {
        navigator.clipboard.writeText(color);
        setCopiedColor(color);
        setTimeout(() => {
            setCopiedColor('');
        }, 500);
    };

    const handleError = (error) => {
        if (error.response) {
            console.error('Server responded with an error status:', error.response.status);
            console.error('Error details:', error.response.data);
        } else if (error.request) {
            console.error('No response received from the server');
        } else {
            console.error('Error setting up the request:', error.message);
        }
        console.error('Full error:', error);
    };

    return (
        <div>
            <div className='header'>
                <h2 className='title' style={{ color: colors.some(c => c.color === newColor) ? 'red' : 'black' }}>Color Palette</h2>
                <div>
                    {!editingColor ? (
                        <>
                            <input type="text" value={newColor} onChange={(e) => setNewColor(e.target.value)} placeholder="Enter color code" />
                            <input type="text" value={colorName} onChange={(e) => setColorName(e.target.value)} placeholder="Enter color name" />
                            <input type="text" value={colorCategory} onChange={(e) => setColorCategory(e.target.value)} placeholder="Enter color category" />
                            <button onClick={addColor}>Add Color</button>
                        </>
                    ) : (
                        <>
                            <p style={{ color: 'blue', fontWeight: 'bold' }}>Editing Color: {editingColor.name}</p>
                            <input type="text" value={editColorValue} onChange={(e) => setEditColorValue(e.target.value)} placeholder="Enter color code" />
                            <input type="text" value={colorName} onChange={(e) => setColorName(e.target.value)} placeholder="Enter color name" />
                            <input type="text" value={colorCategory} onChange={(e) => setColorCategory(e.target.value)} placeholder="Enter color category" />
                            <button onClick={updateColor}>Update Color</button>
                            <button onClick={() => setEditingColor(null)}>Cancel</button>
                        </>
                    )}
                </div>
            </div>
            <div className='color-container'>
                {colors.map((color, index) => (
                    <div className="colorBox" key={index} style={{ backgroundColor: color.color, position: 'relative' }}>
                        <p
                            className="color-name"
                            style={{
                                textAlign: 'center',
                                color: colors.some(c => c.color === newColor) ? 'red' : 'black',
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        >
                            {color.name}
                        </p>
                        <p
                            className="color-code"
                            style={{
                                textAlign: 'center',
                                color: colors.some(c => c.color === newColor) ? 'red' : 'black',
                                position: 'absolute',
                                bottom: '5px',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                fontSize: '12px',
                            }}
                        >
                            {color.color}
                        </p>
                        <div className="edit-button" style={{ position: 'absolute', top: "0", right: "0", fontSize: "20px" }}>
                            <AiFillEdit
    onClick={() => editColor(color)}
    style={{
        color: `black`,
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
        cursor: "pointer"
    }}
/>

<AiOutlineDelete
    onClick={() => deleteColor(color)}
    style={{
        color: `black`,
        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
        cursor: "pointer",
        margin: "0 5px"
    }}
/>

                        </div>
                    </div>
                ))}
            </div>
            {/* Undo Delete Button */}
            {deletedColor && (
                <div style={{ textAlign: 'center', marginTop: '20px', position: "absolute", left: "10px", bottom: "10px", zIndex: "2" }}>
                    <FcUndo onClick={undoDelete} style={{ cursor: 'pointer', fontSize: '20px' }} />
                </div>
            )}
        </div>
    );
};

export default ColorPalette;
