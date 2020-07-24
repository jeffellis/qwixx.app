import React from 'react';

import Row from './Row.js';
import './ScoreCard.scss';

const displayName = "ScoreCard";

const ScoreCard = (props) => {

    return (
        <div className={displayName}>
            <Row color="red"/>
            <Row color="yellow"/>
            <Row color="green"/>
            <Row color="blue"/>
        </div>
    )
};

export default ScoreCard;