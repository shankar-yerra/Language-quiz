import React from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import Navbar from "../components/others/navbar";
// importind from chakra user interface

const Mainpage = () => {
  return (
    <>
      <Navbar />
      {/* styling main page */}
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        textAlign="center"
        flexDirection="column"
        // bgGradient="linear(to-b, teal.200, teal.400)"
        mx={{ base: "0", md: "auto" }}
        p={4}
      >
        <Heading
          as="h1"
          fontSize={{ base: "4xl", md: "5xl" }}
          color="	plum"
          mb={4}
        >
          Welcome to the Language Learning Game!
        </Heading>
        
      </Box>
    </>
  );
};

export default Mainpage;
