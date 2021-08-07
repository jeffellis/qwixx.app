import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import GameContext from '../GameContext';
import useFormValidation from '../useFormValidation';

const MIN_NAME_LENGTH = 5;

const INITIAL_STATE = {
    gameId: "",
    playerName: "",
};

const CreateOrJoinGamePage  = () => {
    const history = useHistory();
    const { joinOrCreateGame } = useContext(GameContext);

    const handleJoinOrCreate = (values) => {
        joinOrCreateGame(values.gameId, values.playerName);
        history.push(`/scorecard/${values.gameId}`);
    };
    const { errors, handleBlur, handleChange, handleSubmit, values } = useFormValidation(INITIAL_STATE, validate, handleJoinOrCreate);
    
    return (        
        <div className="app-page CreateOrJoinGamePage">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="gameId" className="form-label">Enter the name of a game to create or join</label>
                    <input type="text" className="form-control" id="gameId" onBlur={handleBlur} name="gameId" onChange={handleChange} value={values.gameId}/>
                </div>
                {errors.gameId && <p className='text-danger'>{errors.gameId}</p>}
                <div className="mb-3">
                    <label htmlFor="playerName" className="form-label">Enter your name or handle</label>
                    <input type="text" className="form-control" id="playerName" onBlur={handleBlur} name="playerName" onChange={handleChange} value={values.playerName}/>
                </div>
                {errors.playerName && <p className='text-danger'>{errors.playerName}</p>}
                <button className="btn btn-primary" type="submit">Create</button>
            </form>
        </div>
    );
}
 
export default CreateOrJoinGamePage;

const validate = (values) => {
    const errors = {}
    
    if (values.gameId.length < MIN_NAME_LENGTH) {
        errors.gameId = `Game names must be at least ${MIN_NAME_LENGTH} characters long`;
    }

    if (!values.playerName) {
        errors.playerName = 'Make up a name or we will make up one for you!';
    }

    return errors;
};