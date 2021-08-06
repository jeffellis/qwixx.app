import { useEffect, useState } from "react"
import firebase from "./firebase/firebase";

const INITIAL_DICE_VALUES = {
    blue: [6],
    green: [6],
    red: [6],
    white: [6, 6],
    yellow: [6],
};

const INITIAL_GAME_VALUE = {
    diceValues: INITIAL_DICE_VALUES,
    players: 0,
};

const useGame = () => {
    const [currentGame, setCurrentGame] = useState(INITIAL_GAME_VALUE);
    const [gameId, setGameId] = useState();

    const getGamesRef = () => firebase.db.ref('games');

    useEffect(() => {
        if (gameId) {
            const gameRef = getGamesRef().child(gameId);
            const onValueChange = gameRef.on('value', (snapshot) => {
                console.log(snapshot.val(), snapshot.toJSON());
                setCurrentGame(snapshot.val())
            });
    
            return () => gameRef.off('value', onValueChange);    
        }
    },
        [gameId]
    );

    const newGame = () => {
        const id = getGamesRef().push().key;
        getGamesRef().child(id).set(INITIAL_GAME_VALUE);
        setGameId(id);
    }

    const rollDice = () => {
        const diceValues = rollAllDice();
        getGamesRef().child(gameId).update({
            diceValues,
        })
    };

    return { currentGame, newGame, rollDice };
}

export default useGame;

function rollDie() {
    return Math.floor(Math.random() * (6 - 1 + 1) + 1);
}

function rollAllDice() {
    return {
        blue: [rollDie()],
        green: [rollDie()],
        red: [rollDie()],
        white: [rollDie(), rollDie()],
        yellow: [rollDie()],    
    }
}

  