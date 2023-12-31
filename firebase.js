// external import
const { initializeApp } = require("firebase/app");
const dotenv = require("dotenv");

// config env file
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

const firebase = initializeApp(firebaseConfig);

module.exports = firebase;
