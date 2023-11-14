import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
} from "@chakra-ui/react";
// importing from chakra ui
import axios from "axios";
import Navbar from "./navbar";

const LeaderboardPage = () => {
  // creating react hooks
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [lang_id, setLangId] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [languages, setLanguages] = useState([]);
  const [shouldShow, setShouldShow] = useState(false);

  const fetchLanguages = async () => {
    try { // async function
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        }, // header
      };
      const response = await axios.get(
        `http://localhost:5000/quiz/languages`,
        config
      ); // response
      setLanguages(response.data);
    } catch (error) {
      console.error("Error fetching language data:", error);
    } // error
  };

  useEffect(() => { //hook
    fetchLanguages();
  }, []);

  useEffect(() => {
    const getLeaderboard = async (selectedLangId) => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        }, // bearers
      };
      try {
        const response = await axios.get(
          `http://localhost:5000/performance/leaderboard?lang_id=${selectedLangId}`,
          config
        ); // response
        setLeaderboardData(response.data);
      } catch (err) {
        console.log(
          "Error occurred in fetching leaderboard data from the database " + err
        ); // error
      }
    };

    getLeaderboard(lang_id);
    if (lang_id !== "") { // if id id not null
      setShouldShow(true);
    } else {
      setShouldShow(false);
    }
  }, [lang_id]);

  return (
    <>
      <Navbar />
      {/* styling leaderboard */}
      <Box
         p={4}
         borderWidth="1px"
         borderRadius="md"
         background="thistle"
         textAlign="center"
         width="100vw"
         display="flex"
         flexDirection="column"
        
      >
        {shouldShow ? (
          <Text fontSize="xl" fontWeight="bold" mb={4} mt={12} pt={5}>
            Leaderboard for {lang_id.toUpperCase()} Language
          </Text>
        ) : (
          <>
            <Text fontSize="xl" fontWeight="bold" mb={4} mt={12} pt={5}>
              Leaderboard
            </Text>
          </>
        )}
        <Select
          placeholder="Select Language"
          value={lang_id}
          onChange={(e) => {
            setLangId(e.target.value);
          }}
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              {language.toUpperCase()}
            </option>
          ))}
        </Select>
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Rank</Th>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Score</Th>
            </Tr>
          </Thead>
          {leaderboardData.length > 0 ? (
            <Tbody>
              {leaderboardData.map((entry, index) => (
                <Tr key={index}>
                  <Td>{index + 1}</Td>
                  <Td>{entry.uid.name}</Td>
                  <Td>{entry.uid.email}</Td>
                  <Td>{entry.score_percent}</Td>
                </Tr>
              ))}
            </Tbody>
          ) : (
            <Tbody>
              <Tr>
                <Td colSpan="4">No data available</Td>
              </Tr>
            </Tbody>
          )}
        </Table>
      </Box>
    </>
  );
};

export default LeaderboardPage;
