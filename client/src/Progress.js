import React from 'react';

const Progress = (props) => {
    return (
        <div className="progress-container">
            <h2>{props.title}</h2>
            <progress value={props.progress} max="100" className="progress"/>
            <div>{props.progress} %</div>
        </div>
    )
}

export default Progress;