const expressAsyncHandler = require("express-async-handler");
// express functionality

const History = require("../models/historyModel"); 
// creating a constant with name history and proficiency and they store values from models which we can see on profile of the user

const Proficiency = require("../models/proficiencyModel");

const getPerformance = expressAsyncHandler(async (req, res) => { 

  // asynchronous function

  let uid = req.query.uid;
  let lang_id = req.query.lang_id;
  // making variables with id values taken from query

  try {

    const userHistory = await History.find({
      user_id: uid,
      language_id: lang_id,
      // creating a function which finds ids of user and language
    })

      .select("score_percent accuracy")
      .sort({ createdAt: 1 }); // sort by keeping 1st created files at front

    const performanceArray = userHistory.map((history) => ({
      score_percent: history.score_percent,
      accuracy: history.accuracy,
    })); 
    // function uses map between accuracy and score

    const jsonContent = JSON.stringify(performanceArray);
    res.status(200).send(jsonContent); 
    // sending json file content

  } catch (err) {
    res.status(500);
    throw new Error(err); // error while accessing
  }
});

const getLeaderboard = expressAsyncHandler(async (req, res) => {

  // asynchronous function taking requests, response

  let lang_id = req.query.lang_id;

  try {

    const leaderboard = await History.find({ language_id: lang_id })
    // finding id of language and adding its value to const variable leaderboard
      .populate("user_id", "name email")
      .select("score_percent")  // select the option score
      .sort({ score_percent: -1 }); // sorting according to score

    const leaderboardArray = leaderboard.map((lead) => ({
      // created a array which stores values from map
      uid: lead.user_id,
      name: lead.name,
      score_percent: lead.score_percent,
    }));
    const jsonContent = JSON.stringify(leaderboardArray);
    res.status(200).send(jsonContent); // sending status of json content

  } catch (err) {
    res.status(500);
    throw new Error(err);
  } // shows error if any
});

const getProficiency = expressAsyncHandler(async (req, res) => {
  const uid = req.query.uid;
  const proficiencyData = await Proficiency.find({ user_id: uid }).select(
    "language_id proficiencyLevel"
  );
  // finding user id and adding value to const variable
  res.status(200).json(proficiencyData);
});

const deleteHistory = expressAsyncHandler(async (req, res) => {
  const uid = req.query.uid;
  try {
    // try catch block
    const isDeleted = await History.deleteMany({ user_id: uid });
    // deletes history of user with particular id
    await Proficiency.updateMany(
      { user_id: uid },
      { proficiencyLevel: "Apprentice" }
    ); // updates data
    if (isDeleted) {
      res.status(200).send("Performance History deleted for the user");
    }
  } catch (err) {
    res.status(500);
    throw new Error(err); // throws error if any
  }
});

module.exports = { // exporting functions
  getPerformance,
  getLeaderboard,
  getProficiency,
  deleteHistory,
};
