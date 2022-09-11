import React from 'react';
import './ModalWindow.scss'

const ModalWindow = ({children}) => {
    return (
        <div className='modalWindow'>
            {children}
        </div>
    );
};

export default ModalWindow;