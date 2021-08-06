import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import GameContext from '../GameContext';
import useFormValidation from '../useFormValidation';

const MIN_NAME_LENGTH = 8;

const INITIAL_STATE = {
    name: ""
};

const CreateOrJoinGamePage  = () => {
    const history = useHistory();
    const { joinOrCreateGame } = useContext(GameContext);

    const handleJoinOrCreate = (values) => {
        joinOrCreateGame(values.name);
        history.push(`/scorecard/${values.name}`);
    };
    const { errors, handleBlur, handleChange, handleSubmit, values } = useFormValidation(INITIAL_STATE, validate, handleJoinOrCreate);
    
    return (        
        <div className="app-page CreateOrJoinGamePage">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Enter the name of a game to create or join</label>
                    <input type="text" className="form-control" id="name" onBlur={handleBlur} name="name" onChange={handleChange} value={values.name}/>
                </div>
                {errors.name && <p>{errors.name}</p>}
                <button className="btn btn-primary" type="submit">Create</button>
            </form>
        </div>
    );
}
 
export default CreateOrJoinGamePage;

const validate = (values) => {
    const errors = {}
    const nameValue = values.name;
    
    console.log(nameValue)
    if (nameValue.length < MIN_NAME_LENGTH) {
        errors.name = `Game names must be at least ${MIN_NAME_LENGTH} characters long`;
    }

    return errors;
};