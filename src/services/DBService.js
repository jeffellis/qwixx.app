import { openDB } from "idb";

const CURRENT_SCORECARD_KEY = "current";
const DATABASE_NAME = "QWIXX";
const DATABASE_VERSION = 2;
const SCORECARD_STORE = "ScoreCards";
const APP_STORE = "App";
const USER_KEY = "user";

const upgrade = (db, oldVersion, newVersion, tx) => {
  if (oldVersion === 0) {
    db.createObjectStore(SCORECARD_STORE);
    oldVersion++;
  }
  if (oldVersion === 1) {
    db.createObjectStore(APP_STORE);
    oldVersion++;
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

export const saveUser = async (user) => {
  return await dbPromise.put(APP_STORE, user, USER_KEY);
};

export const getUser = async () => {
  return dbPromise.get(APP_STORE, USER_KEY);
};
