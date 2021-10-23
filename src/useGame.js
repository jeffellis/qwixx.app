import { useEffect, useRef, useState } from "react"
import { without } from "lodash"
import firebase from "./firebase/firebase";

export const INITIAL_DICE_VALUES = {
    blue: [6],
    green: [6],
    red: [6],
    white: [6, 6],
    yellow: [6],
};

const MAX_PLAYERS = 5;

const INITIAL_GAME_VALUE = {
    currentTurn: {
        diceValues: INITIAL_DICE_VALUES,
        player: 0,    
    }
};

const getPlayerNames = (players) => players.map((player) => player.name);

const findPlayerForUser = (players, user) => players.find((player) => player.uid === user.uid);

const useGame = ({ onError, onPlayersAdded, user }) => {
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [diceValues, setDiceValues] = useState(null);
    const [gameId, setGameId] = useState(null);
    const [hasRolledOnThisTurn, setHasRolledOnThisTurn] = useState(false);
    const [myPlayer, setMyPlayer] = useState({});
    const [players, setPlayers] = useState([]);
    const subscriptions = useRef([]);

    const getGamesRef = () => firebase.getRef('games');

    useEffect(() => {
        initializeGame(gameId);

        return unsubscribeAll;
    },
        [gameId]
    );

    useEffect(() => {
        if (user) {
            const playerForUser = findPlayerForUser(players, user);
            if (playerForUser) {
                setMyPlayer(playerForUser);
                console.log('effect: player set', playerForUser);    
            }
        }
    }, [players, user]);

    const initializeGame = (gameId) => {
        if (gameId) {
            unsubscribeAll();
            subscriptions.current.push(
                firebase.subscribe(`games/${gameId}/currentTurn/diceValues`,
                    (snapshot) => {
                        setDiceValues(snapshot.val())
                    }
                )
            );

            subscriptions.current.push(
                firebase.subscribe(`games/${gameId}/currentTurn/player`,
                    (snapshot) => {                    
                        setCurrentPlayerIndex(snapshot.val());
                    }
                )
            );

            subscriptions.current.push(
                firebase.subscribe(`games/${gameId}/players`,
                    (playersSnapshot) => {
                        const snapshot = playersSnapshot.val();
                        if (snapshot) {
                            setPlayers((currentPlayers) => {
                                const updatedPlayers = Object.values(snapshot).sort((p1, p2) => p2.order - p1.order);
                                const newPlayers = without(getPlayerNames(updatedPlayers), ...getPlayerNames(currentPlayers))
                                onPlayersAdded && onPlayersAdded(newPlayers);
                                console.log('players updated', updatedPlayers);
                                return updatedPlayers;
                            });                            
                        }
                    }
                )
            );
        }
    }

    const unsubscribeAll = () => {
        subscriptions.current.forEach((sub) => sub());
        subscriptions.current = [];
    }

    const newGame = () => {
        // const id = getGamesRef().push().key;
        // getGamesRef().child(id).set(INITIAL_GAME_VALUE);
        joinOrCreateGame('nervous-nelly');
    }

    const createOrResetGame = (gameId) => {
        return firebase.set(`games/${gameId}/currentTurn`, INITIAL_GAME_VALUE.currentTurn);
    };

    const addPlayer = async (gameId, user) => {
        const joinDate = new Date();
        debugger;
        const playerData = {
            joined: joinDate.toISOString(),
            name: user.displayName,
            order: Math.random(),
            uid: user.uid,
        };

        try {
            await firebase.set(`games/${gameId}/players/${playerData.name}`, playerData);
            setMyPlayer(playerData);
        } catch (error) {
            console.error(`Error adding ${playerData.name} to ${gameId}`);
        }
    }

    const playerCount = (players = {}) => {
        return Object.keys(players).length;
    };

    const joinOrCreateGame = async (gameName, user) => {
        try {
            const gameRef = await firebase.get(`games/${gameName}`);
            const gameData = gameRef.val();
            if (gameData) {
                if (playerCount(gameData?.players) < MAX_PLAYERS) {
                    setGameId(gameName)
                    if (!gameData?.players[user.displayName]) {
                        await addPlayer(gameName, user);    
                    }
                } else {
                    onError && onError(`${gameName} already has ${MAX_PLAYERS} players`);
                    setGameId(null);
                }
                return;
            }
            await createOrResetGame(gameName);
            await addPlayer(gameName, user);
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
        setGameId,
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

  