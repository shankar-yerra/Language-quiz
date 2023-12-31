import React, { useEffect, useState } from "react";
import { Box, Text, Button, Container, useToast } from "@chakra-ui/react";
import Navbar from "./navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const [proficiencyArr, setProficiencyArr] = useState([]);
  const toast = useToast();

  useEffect(() => {
    const getProficiency = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      try {
        const response = await axios.get(
          `http://localhost:5000/performance/proficiency?uid=${userInfo._id}`,
          config
        );
        setProficiencyArr(response.data);
      } catch (error) {
        console.error("Error fetching proficiency data: ", error);
      }
    };

    getProficiency();
  }, [userInfo.token, userInfo._id]);

  const user = {
    username: userInfo.name,
    email: userInfo.email,
  };

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/", { replace: "true" });
  };

  const handleReset = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    try {
      const isResetDone = await axios.get(
        `http://localhost:5000/performance/deletehistory?uid=${userInfo._id}`,
        config
      );
      if (isResetDone) {
        toast({
          title: "History Reset",
          description:
            "Your performance history has been deleted successfully. Restart your learning journey freshly.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error in resetting history: ", error);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxW="lg" py={8} mt={10}>
        <Box
          borderWidth="1px"
          p={4}
          borderRadius="md"
          background="silver"
          textAlign="center"
          mt={5}
        >
          <Text
            fontSize="3xl"
            fontWeight="bold"
            fontFamily="'Agbalumo', sans-serif"
            color="#000738"
          >
            Profile
          </Text>
          <Text mt={2} fontSize="xl" textAlign="start">
            <b>Name:</b> {user.username}
          </Text>
          <Text fontSize="xl" textAlign="start">
            <b>Email:</b> {user.email}
          </Text>
          <Text fontSize="xl" textAlign="start">
            <b>Role:</b> {userInfo.isTeacher ? <>Teacher</> : <>Student</>}
          </Text>
          <Button colorScheme="red" mt={5} onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Box
          borderWidth="1px"
          p={4}
          borderRadius="md"
          background="silver"
          mt={5}
          textAlign="center"
        >
          <Text
            fontSize="2xl"
            fontWeight="bold"
            textAlign="center"
            mb={5}
            fontFamily="'Agbalumo', sans-serif"
            color="#000738"
          >
            Proficiency List
          </Text>
          {proficiencyArr.length > 0 ? (
            proficiencyArr.map((prof) => (
              <Box
                key={prof._id}
                borderWidth="1px"
                p={4}
                borderRadius="md"
                background="white"
                textAlign="center"
                mb={2}
              >
                <Text textTransform="uppercase">
                  {prof.language_id} : {prof.proficiencyLevel}
                </Text>
              </Box>
            ))
          ) : (
            <Text fontSize="1.1rem">No data available to show</Text>
          )}
          <Button colorScheme="green" mt={6} onClick={handleReset}>
            Reset History
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default ProfilePage;
