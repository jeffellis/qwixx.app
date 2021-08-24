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

    const getGamesRef = () => firebase.db.ref('games');

    useEffect(() => {
        if (gameId) {
            const onDiceChange = getGamesRef().child(`${gameId}/currentTurn/diceValues`).on('value', (snapshot) => {
                setDiceValues(snapshot.val())
            });

            const onCurrentPlayerChange = getGamesRef().child(`${gameId}/currentTurn/player`).on('value', (snapshot) => {
                setCurrentPlayerIndex(snapshot.val());
            });

            const onPlayersChange = getGamesRef().child(`${gameId}/players`).on('value', (playersSnapshot) => {
                setPlayers((currentPlayers) => {
                    const updatedPlayers = Object.values(playersSnapshot.val()).sort((p1, p2) => p2.order - p1.order);
                    const newPlayers = without(getPlayerNames(updatedPlayers), ...getPlayerNames(currentPlayers))
                    console.log(newPlayers)
                    onPlayersAdded && onPlayersAdded(newPlayers);
                    return updatedPlayers;
                });
            })
    
            return () => {
                getGamesRef().child(`${gameId}/players`).off('value', onPlayersChange);
                getGamesRef().child(`${gameId}/currentTurn/diceValues`).off('value', onDiceChange);
                getGamesRef().child(`${gameId}/currentTurn/player`).on('value', onCurrentPlayerChange);
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

    const addPlayer = (gameId, playerName) => {
        const joinDate = new Date();
        const playerData = {
            joined: joinDate.toISOString(),
            name: playerName,
            order: Math.random(),
        };

        return getGamesRef().child(`${gameId}/players/${playerName}`)
            .set(playerData).then(() => {
                console.log(`Adding "${playerName}" to game ${gameId}`);
                setMyPlayer(playerData);
            }).catch((error) => {
                console.error(`Error adding ${playerName} to ${gameId}`);
            });
    }

    const joinOrCreateGame = (gameName, playerName) => {
        getGamesRef().child(gameName).get()
            .then((game) => {
                if (game.val()) {
                    setGameId(gameName)
                    return addPlayer(gameName, playerName);
                }
                
                return createOrResetGame(gameName)
                    .then(() => {
                        setGameId(gameName);
                        return addPlayer(gameName, playerName);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            })
            .catch((error) => {
                console.error(`Error joining game ${gameName}:`, error);
            });
    }

    const rollDice = () => {
        const diceValues = rollAllDice();
        getGamesRef().child(gameId).child('currentTurn').update({
            diceValues,
        })
        setHasRolledOnThisTurn(true);
    };

    const getNextPlayer = () => {
        return currentPlayerIndex === players.length - 1 ? 0 : currentPlayerIndex + 1;
    }

    const completeTurn = () => {
        setHasRolledOnThisTurn(false);
        getGamesRef().child(`${gameId}/currentTurn/player`).set(getNextPlayer());
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

  