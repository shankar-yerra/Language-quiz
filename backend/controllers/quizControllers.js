const expressAsyncHandler = require("express-async-handler");
// created const variables which access data from models
const Question = require("../models/questionModel");
const History = require("../models/historyModel");
const Proficiency = require("../models/proficiencyModel");

const updateProficiency = async (uid, lang_id) => {
  // asynchronous function which in takes userid and language id
  
  let total_score_percent = 0,
    total_accuracy = 0;
  let prof;
  // initialising total accuracy and score to 0

  try {
    // try catch block
    const userHistory = await History.find({
      // finding user id and language id
      user_id: uid,
      language_id: lang_id,
    }).select("score_percent accuracy");

    let n = userHistory.length;
    // running a loop from 0 to n of an array to add score, accuracy
    for (let i = 0; i < n; i++) {
      const history = userHistory[i];
      total_score_percent =
        total_score_percent + parseFloat(history.score_percent);
      total_accuracy = total_accuracy + parseFloat(history.accuracy);
    }

    let avg_score = total_score_percent / n;
    let avg_accuracy = total_accuracy / n;
    prof = (avg_accuracy + avg_score) / 2;
    // calculating average score,accuracy
    
  } catch (err) {
    throw new Error(err); // throws error if any
  }

  let newProfiencyLevel;
  // conditions to give a level
  if (prof >= 90) {
    newProfiencyLevel = `Master(${parseInt(prof)})`;
  } else if (prof >= 80) {
    newProfiencyLevel = `Candidate Master(${parseInt(prof)})`;
  } else if (prof >= 70) {
    newProfiencyLevel = `Expert(${parseInt(prof)})`;
  } else if (prof >= 60) {
    newProfiencyLevel = `Specialist(${parseInt(prof)})`;
  } else {
    newProfiencyLevel = `Apprentice(${parseInt(prof)})`;
  }

  try {
    await Proficiency.findOneAndUpdate(
      // finding user id and language id and updating levels
      { user_id: uid, language_id: lang_id },
      { proficiencyLevel: newProfiencyLevel },
      { new: true }
    );
  } catch (err) {
    console.error(err);
  }
};

const getQuestions = expressAsyncHandler(async (req, res) => {
  const { language_id, category } = req.body;
  if (!language_id || !category) {
    // condition for checking details
    res.status(400);
    throw new Error("Please send all the required details");
  }
  const filter = {

    language_id: language_id,
    category: category,
  };
  try {
    const data = await Question.find(filter).select("-correct_answer");
    res.status(200).json(data);
    // json data status
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
    // error
  }
});

const getAnswers = expressAsyncHandler(async (req, res) => {
  // function for evaluation of results
  let uid = req.body.uid;
  let lang_id;
  let level;
  let positiveMarks = 0,
    negativeMarks = 0,
    unAttempted = 0;
  const pairs = req.body.pairs;
  let totalMarks = pairs.length;

  for (let i = 0; i < pairs.length; i++) {
    // creating a loop and adding try catch block
    const pair = pairs[i];
    let objId = pair.objectId;
    let givenAns = pair.givenAnswer;

    try {
      const question = await Question.findById(objId);
      // finding by object id
      if (question) {
        // conditions for evaluation
        lang_id = question.language_id;
        level = question.category;
        if (givenAns !== "-1" && question.correct_answer === givenAns) {
          positiveMarks = positiveMarks + 1;
        } else if (givenAns !== "-1" && question.correct_answer !== givenAns) {
          negativeMarks = negativeMarks + 1;
        } else {
          unAttempted = unAttempted + 1;
        }
      } else {
        console.log("No question found with the provided objectId");
      }

    } catch (err) {
      res.status(500);
      throw new Error(err);
      // error pop up
    }
  }

  let accuracy_val = 0;
  if (totalMarks !== unAttempted) {
    // calculation
    accuracy_val = (positiveMarks * 100) / (totalMarks - unAttempted);
  }

  const report = {
    // function with following varaibles
    totalMarks: totalMarks,
    corrected: positiveMarks,
    incorrected: negativeMarks,
    attempted: totalMarks - unAttempted,
    unAttempted: unAttempted,
    score: positiveMarks - negativeMarks / 2,
    scorePercentage: ((positiveMarks - negativeMarks / 2) * 100) / totalMarks,
    accuracy: accuracy_val,
  };

  const jsonContent = JSON.stringify(report);
  res.status(200).send(jsonContent);
  // sending status of json content files

  try {
    const newChapter = {
      // creating a function
      user_id: uid,
      language_id: lang_id,
      score_percent: ((positiveMarks - negativeMarks / 2) * 100) / totalMarks,
      accuracy: accuracy_val,
    };
    const h = await History.create(newChapter);
  } catch (err) {
    res.status(400);
    throw new Error(err);
    // throws error if any
  }

  const p_level = await Proficiency.findOne({
    // finding user id and language id
    user_id: uid,
    language_id: lang_id,
  });
  if (p_level) {
    updateProficiency(uid, lang_id).then();
    // updating level
  } else {
    const newUserProf = {
      // creating new profile for user with user id, language id, level
      user_id: uid,
      language_id: lang_id,
      proficiencyLevel: "Apprentice",
    };
    try {
      const isCreated = await Proficiency.create(newUserProf);
      // creating new profile
      if (isCreated) {
        updateProficiency(uid, lang_id).then();
        // updating data if user profile is created
        console.log("New Proficiency created");
      } else {
        console.log("New Proficiency creation failed");
      }
    } catch (err) {
      // error if any
      console.error(err);
    }
  }
});

const getLanguages = expressAsyncHandler(async (req, res) => {
  // async function taking requests and response
  const languages = await Question.distinct("language_id");
  // adding distinct language ids into a const variable
  if (languages) {
    // condition for finding language
    res.status(200).send(languages);
  } else {
    res.status(500);
    throw new Error("Failed to find all the languages in the database");
    // error if any
  }
});

module.exports = { getQuestions, getAnswers, getLanguages };
// 3 modules exporting
