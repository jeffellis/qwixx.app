import { useEffect, useState } from "react"
import { without } from "lodash"
import firebase from "./firebase/firebase";

export const INITIAL_DICE_VALUES = {
    blue: [6],
    green: [6],
    red: [6],
    white: [6, 6],
    yellow: [6],
};

const INITIAL_GAME_VALUE = {
    currentTurn: {
        diceValues: INITIAL_DICE_VALUES,
        player: 0,    
    }
};

const getPlayerNames = (players) => players.map((player) => player.name);

const useGame = ({ initialGameId, onPlayersAdded }) => {
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [diceValues, setDiceValues] = useState();
    const [gameId, setGameId] = useState(initialGameId);
    const [hasRolledOnThisTurn, setHasRolledOnThisTurn] = useState(false);
    const [myPlayer, setMyPlayer] = useState({});
    const [players, setPlayers] = useState([]);

    const getGamesRef = () => firebase.getRef('games');

    useEffect(() => {
        if (gameId) {
            const cancelDiceChange = firebase.subscribe(`games/${gameId}/currentTurn/diceValues`, (snapshot) => {
                setDiceValues(snapshot.val())
            });

            const cancelCurrentPlayerChange = firebase.subscribe(`games/${gameId}/currentTurn/player`, (snapshot) => {
                setCurrentPlayerIndex(snapshot.val());
            });

            const cancelPlayersChange = firebase.subscribe(`games/${gameId}/players`, (playersSnapshot) => {
                setPlayers((currentPlayers) => {
                    const updatedPlayers = Object.values(playersSnapshot.val()).sort((p1, p2) => p2.order - p1.order);
                    const newPlayers = without(getPlayerNames(updatedPlayers), ...getPlayerNames(currentPlayers))
                    console.log(newPlayers)
                    onPlayersAdded && onPlayersAdded(newPlayers);
                    return updatedPlayers;
                });
            })
    
            return () => {
                cancelCurrentPlayerChange();
                cancelDiceChange();
                cancelPlayersChange();
            }
        }
    },
        [gameId]
    );

    const newGame = () => {
        // const id = getGamesRef().push().key;
        // getGamesRef().child(id).set(INITIAL_GAME_VALUE);
        joinOrCreateGame('nervous-nelly');
    }

    const createOrResetGame = (gameId) => {
        return getGamesRef().child(gameId).child('currentTurn')
            .set(INITIAL_GAME_VALUE.currentTurn);
    };

    const addPlayer = async (gameId, playerName) => {
        const joinDate = new Date();
        const playerData = {
            joined: joinDate.toISOString(),
            name: playerName,
            order: Math.random(),
        };

        try {
            await firebase.set(`game/${gameId}/players/${playerName}`, playerData);
            setMyPlayer(playerData);
        } catch (error) {
            console.error(`Error adding ${playerName} to ${gameId}`);
        }
    }

    const joinOrCreateGame = async (gameName, playerName) => {
        try {
            const game = await firebase.get(`games/${gameName}`);
            if (game.val()) {
                setGameId(gameName)
                return addPlayer(gameName, playerName);
            }
            await createOrResetGame(gameName);
            setGameId(gameName);

        } catch (error) {
            console.error(`Error joining game ${gameName}:`, error);
        }
    }

    const rollDice = async () => {
        const diceValues = rollAllDice();
        try {
            await firebase.update(`games/${gameId}/currentTurn`, { diceValues });
            setHasRolledOnThisTurn(true);
        } catch (error) {
            console.error(error);
        }
    };

    const getNextPlayer = () => {
        return currentPlayerIndex === players.length - 1 ? 0 : currentPlayerIndex + 1;
    }

    const completeTurn = () => {
        setHasRolledOnThisTurn(false);
        firebase.set(`games/${gameId}/currentTurn/player`, getNextPlayer());
    }

    const myTurn = players[currentPlayerIndex] && myPlayer && players[currentPlayerIndex].name === myPlayer.name;

    return {
        completeTurn,
        currentPlayer: players[currentPlayerIndex],
        diceValues,
        hasRolledOnThisTurn,
        joinOrCreateGame,
        gameId,
        myTurn,
        newGame,
        numPlayers: players ? players.length : 0,
        players,
        rollDice,
    };
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

  