import { openDB } from "idb";

const CURRENT_SCORECARD_KEY = "current";
const DATABASE_NAME = "QWIXX";
const DATABASE_VERSION = 1;
const SCORECARD_STORE = "ScoreCards";

const upgrade = (db, oldVersion, newVersion, tx) => {
  if (oldVersion === 0) {
    db.createObjectStore(SCORECARD_STORE);
  }
};

let dbPromise;

export const initDB = async () => {
  dbPromise = await openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade,
    blocked() {
      console.log("[openDB]: blocked");
    },
    blocking() {
      console.log("[openDB]: blocking");
    },
    terminated() {
      console.log("[openDB]: terminated");
    },
  });
  return dbPromise;
};

export const saveScoreCard = async (scorecard) => {
  return await dbPromise.put(SCORECARD_STORE, scorecard, CURRENT_SCORECARD_KEY);
};

export const getScoreCard = async () => {
  return dbPromise.get(SCORECARD_STORE, CURRENT_SCORECARD_KEY);
};
