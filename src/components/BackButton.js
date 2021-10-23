import React from "react";
import { useHistory } from "react-router";

import "./BackButton.scss";

const BackButton = (props) => {
    const history = useHistory();

    const goBack = () => {
        if (history.length <= 0) {
            history.push('/');
        }
        history.goBack();
    };

    return (
        <button className="btn btn-link BackButton" onClick={goBack} type="button"/>
    );
};

export default BackButton;
