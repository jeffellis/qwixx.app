import React from 'react';

import './Row.scss';

const displayName = 'Row';

const Row = (props) => {

    return (
        <div className={`${displayName} ${displayName}-${props.color}`}>

        </div>
    );
};

export default Row;