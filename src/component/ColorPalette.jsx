import React, { useState, useEffect } from 'react';
import './color.css';
import axios from 'axios';
import { toast, ToastContainer, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ColorPalette = () => {
    const [colors, setColors] = useState([]);
    const [newColor, setNewColor] = useState('');

    useEffect(() => {
        fetchColors();
    }, []);

    const fetchColors = async () => {
        try {
            const response = await axios.get('color-api-blond.vercel.app/colors');
            setColors(response.data);
        } catch (error) {
            console.error('Error fetching colors:', error);
        }
    };

    const addColor = async () => {
        try {
            // Check if newColor starts with #
            const colorToAdd = newColor.startsWith('#') ? newColor : `#${newColor}`;
            await axios.post('http://localhost:7000/colors', { color: colorToAdd }); // Send colorToAdd to the server
            fetchColors(); // Fetch updated colors after adding
            setNewColor(''); // Clear input after adding
            toast.success("Color added successfully!"); // Show toast notification
        } catch (error) {
            console.error('Error adding color:', error);
        }
    };

    const copyColorCode = (color) => {
        navigator.clipboard.writeText(color);
        setTimeout(() => {
            toast.success("Color code copied to clipboard!");
        }, 300);
    };

    return (
        <div>
            <div className='header'>
                <h2 className='title' style={{ color: colors.some(c => c.color === newColor) ? 'red' : 'black' }}>Color Palette</h2>
                <div>
                    <input type="text" value={newColor} onChange={(e) => setNewColor(e.target.value)} placeholder="Enter color code" />
                    <button onClick={addColor}>Add Color</button>
                </div>
            </div>
            <div className='color-container'>
                {colors.map((color, index) => (
                    <div className="colorBox" key={index} style={{ backgroundColor: color.color}}>
                        <button className="copy-button button-38" onClick={() => copyColorCode(color.color)}>Copy</button>
                        <p style={{ textAlign: 'center' }}>{color.color}</p> {/* Display color code below the color div */}
                    </div>
                ))}
            </div>
            <ToastContainer
                position="top-center"
                autoClose={500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </div>
    );
};

export default ColorPalette;
