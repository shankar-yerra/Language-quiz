import { React, useEffect } from "react";
// importing all files
import {
  Container,
  Box,
  Text,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Center,
  Stack,
  Link,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate(); // hooks

  useEffect(() => {
    // navigation purpose
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) {
      // after user login, enter into main page
      navigate("/main");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      {/* styling home page*/}
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg="wheat"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize={{ base: "3xl", md: "4xl" }} fontFamily="'Agbalumo', sans-serif" color="#000738">
          <Center>Language Learning Game</Center>
        </Text>
      </Box>
      <Box bg="	wheat" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs variant="soft-rounded">
          <TabList mb="1em">
            <Tab width="50%" _selected={{ color: 'white', bg: 'teal.400' }}>Login</Tab>
            <Tab width="50%" _selected={{ color: 'white', bg: 'tomato' }}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      
    </Container>
  );
};

export default Homepage;
