import React from 'react';
import ProjectBody from './ProjectBody/ProjectBody';
import './Board.scss'

const Board = () => {
    return (
        <div className='board'>
            <p className='board__title'>Тренажер слепой печати</p>
            <ProjectBody />
        </div>
    );
};

export default Board;