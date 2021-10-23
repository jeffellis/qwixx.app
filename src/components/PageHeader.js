import React from "react";
import BackButton from "./BackButton";

import './PageHeader.scss';

const PageHeader = ({ className, title }) => {
    className = className ?? '';
    return (
        <div className={`PageHeader ${className}`}>
            <BackButton />
            <h2 className="PageHeader-title">{title}</h2>
        </div>
    )
};

export default PageHeader;