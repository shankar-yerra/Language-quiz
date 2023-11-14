import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  VStack,
  Radio,
  RadioGroup,
  Button,
  Container,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import Navbar from "./navbar";
import { color } from "framer-motion";

const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [category, setCategory] = useState("");
  const [lang_id, setLangId] = useState("");
  const [initialRenderQuestions, setInitialRenderQuestions] = useState(true);
  const [initialRenderAnswers, setInitialRenderAnswers] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [languages, setLanguages] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [responseDetails, setResponseDetails] = useState({});
  const [shouldShow, setShouldShow] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const fetchLanguages = async () => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const response = await axios.get(
        `http://localhost:5000/quiz/languages`,
        config
      );
      setLanguages(response.data);
    } catch (error) {
      console.error("Error fetching language data:", error);
    }
  };

  const getQuestions = async (lang_id, category) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const response = await axios.post(
        "http://localhost:5000/quiz/questions",
        {
          language_id: lang_id,
          category: category,
        },
        config
      );
      if (lang_id && category) {
        setQuestions(response.data);
      }
    } catch (err) {
      console.log("Error occurred in fetching questions from the database");
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    // prevent the first render
    if (initialRenderQuestions) {
      setInitialRenderQuestions(false);
      return;
    }
    if (lang_id !== "" && category !== "") {
      getQuestions(lang_id, category);
      setShouldShow(true);
    } else {
      setShouldShow(false);
    }
  }, [lang_id, category]);

  // will fill "-1" as answer of every mcq questions whenever the questions are set
  useEffect(() => {
    // This will prevent the first render
    if (initialRenderAnswers) {
      setInitialRenderAnswers(false);
      return;
    }
    if (questions.length) {
      setSelectedAnswers((prevSelectedAnswers) => {
        const updatedAnswers = { ...prevSelectedAnswers };
        questions.forEach((question) => {
          updatedAnswers[question._id] = "-1";
        });
        return updatedAnswers;
      });
    }
  }, [questions]);

  const handleOptionSelect = (questionId, selectedOption) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: selectedOption,
    });
  };
  const handleSubmit = async () => {
    try {
      const dataToSend = {
        uid: userInfo._id,
        pairs: Object.entries(selectedAnswers).map(
          ([objectId, givenAnswer]) => ({
            objectId: objectId,
            givenAnswer: givenAnswer,
          })
        ),
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const response = await axios.post(
        "http://localhost:5000/quiz/answers",
        dataToSend,
        config
      );
      setResponseDetails(response.data);
      onOpen();
    } catch (error) {
      console.error("Error submitting test:", error);
      alert("Error submitting test. Please try again.");
    }
  };

  return (
    <>
    {/* styling of testpage */}
      <Navbar />
      <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
        <ModalOverlay />
        <ModalContent
          textAlign="center"
          maxW={{ base: "95%", md: "lg", lg: "2xl" }}
        >
          <ModalHeader fontSize="3xl"
          // style={{ color:"red" }}
          fontWeight="bold"
          color="red.600"
          >Quiz Result</ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize="xl">
            <Text textAlign="start"><b>Total Questions:</b> {responseDetails.totalMarks}</Text>
            <Text textAlign="start"><b>Attempted:</b> {responseDetails.attempted}</Text>
            <Text textAlign="start"><b>Unattempted:</b> {responseDetails.unAttempted}</Text>
            <Text textAlign="start"><b>Correctly Answered:</b> {responseDetails.corrected}</Text>
            <Text textAlign="start"><b>Incorectly Answered:</b> {responseDetails.incorrected}</Text>
            <Text textAlign="start"><b>Total Marks:</b> {responseDetails.totalMarks}</Text>
            <Text textAlign="start"><b>Your Score:</b> {responseDetails.score}</Text>
            <Text textAlign="start"><b>Accuracy:</b> {responseDetails.accuracy}%</Text>
            
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Container maxW="xl" py={8} px={4} mt={12}>
        <Text
          textAlign="center"
          fontSize={{ base: "2xl", md: "4xl" }}
          fontWeight="bold"
          color="tomato"
          mt={3}
          mb={5}
        >
          Let's start the game !
        </Text>
        <Select
          placeholder="Choose Language"
          value={lang_id}
          onChange={(e) => {
            setLangId(e.target.value);
          }}
          background="plum"
          mb={5}
          fontSize="lg"
          textAlign="center"
        >
          {languages.map((language) => (
            <option key={language} value={language} style={{color:"orange"}}>
              {language.toUpperCase()}
              
            </option>
          ))}
        </Select>
        <Select
          id="difficulty"
          background="plum"
          mb={5}
          placeholder="Choose Difficulty"
          value={category}
          fontSize="lg"
          textAlign="center"
          onChange={(e) => {
            setCategory(e.target.value);
          }}
        >
          <option value="easy" style={{color:"green"}}>Easy</option>
          <option value="medium" style={{color:"orange"}}>Medium</option>
          <option value="hard" style={{color:"red"}}>Hard</option>
        </Select>
        {shouldShow ? (
          <VStack spacing={3}>
            <Text
              fontSize="2xl"
              // fontWeight="bold"
              color="white"
              textAlign="center"
              fontFamily= "'Agbalumo', sans-serif"
              mb={0}
            >
              {/* Quiz of {lang_id.toUpperCase()}  */}
              Quiz of {lang_id} language
            </Text>
            <Text
              fontSize="xl"
              //fontWeight="bold"
              color="teal"
              textAlign="center"
              fontFamily= "'Agbalumo', sans-serif"
            >
              {/* Level: {category.toUpperCase()} */}
              Level : {category.charAt(0).toUpperCase() + category.slice(1)} 
            </Text>
            <form>
              {questions.map((question, ind) => (
                <Box
                  key={question._id}
                  borderWidth="1px"
                  p={4}
                  borderRadius="md"
                  background="paleturquoise"
                  fontSize="xl"
                  mb={5}
                >
                  <Text mb={5}>
                    {ind + 1}. {question.desc}
                  </Text>
                  <RadioGroup
                    value={selectedAnswers[question._id] || "-1"}
                    onChange={(value) =>
                      handleOptionSelect(question._id, value)
                    }
                    display="flex"
                    flexDirection="column"
                    // color="green"
                  >
                    {JSON.parse(question.options).map((option, index) => (
                      <Radio key={index} value={index.toString()} mb={5} bgColor="		plum">
                        {option}
                      </Radio >
                    ))}
                  </RadioGroup>
                </Box>
              ))}
              <Center>
                <Button style={{backgroundColor: "tomato", color:"white" }}
                 mt={4} onClick={handleSubmit}>
                  Submit Test
                </Button>
              </Center>
            </form>
          </VStack>
        ) : (
          <Text mt={5} fontSize="xl" color="white" textAlign="center">
            Select a language & difficulty level... 
          </Text>
        )}
      </Container>
    </>
  );
};

export default TestPage;
