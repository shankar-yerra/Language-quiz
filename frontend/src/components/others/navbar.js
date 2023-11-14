import React from "react";
import {
  Box,
  Flex,
  Spacer,
  Link,
  Text,
  Avatar,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
// importing from chakra ui

const Navbar = () => {
  // nav bar styling
  const navbarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 1000,
    fontFamily: "'Agbalumo', sans-serif",
    fontSize: "20px",
    
  };
  const linkStyle = {
    textDecoration: "none",
  };
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    // styling
    <Flex align="center" bg="none" p={4} color="goldenrod" style={navbarStyle}>
      <IconButton
        icon={<HamburgerIcon />}
        aria-label="Open Menu"
        display={{ base: "block", md: "none" }}
        onClick={onOpen}
      />
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">
              {" "}
              <IconButton
                icon={<CloseIcon />}
                size="sm"
                aria-label="Close"
                onClick={onClose}
                position="absolute"
                top={2}
                right={2}
              />{" "}
              Menu
            </DrawerHeader>
            <DrawerBody>
              {/*  navigation */}
              <Link href="/testpage" style={linkStyle}>
                <Box display="flex" alignItems="center" mr={6} mb={4}>
                  <Text>Test</Text>
                </Box>
              </Link>
              <Link href="/performance" style={linkStyle}>
                <Box display="flex" alignItems="center" mr={6} mb={4}>
                  <Text>Performance</Text>
                </Box>
              </Link>
              <Link href="/leaderboard" style={linkStyle}>
                <Box display="flex" alignItems="center" mr={6} mb={4}>
                  <Text>Leaderboard</Text>
                </Box>
              </Link>

              {userInfo.isTeacher && 
              <Link href="/uploadQuestion" style={linkStyle}>
                <Box display="flex" alignItems="center" mr={6} mb={4}>
                  <Text>Upload</Text>
                </Box>
              </Link>
              }

              <Link href="/profile" style={linkStyle}>
                <Box display="flex" alignItems="center" mr={4} mb={4}>
                  <Avatar size="sm" src="https://bit.ly/broken-link" bg='teal.500' />
                  {/* <Text ml={2}>Profile</Text> */}
                </Box>
              </Link>
            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      {/* testpage navigation */}
      <Link href="/testpage" style={linkStyle}>
        <Box display={{ base: "none", md: "flex" }} alignItems="center" mr={6}>
          <Text>Test</Text>
        </Box>
      </Link>

        {/* performance navigation */}      
      <Link href="/performance" style={linkStyle}>
        <Box display={{ base: "none", md: "flex" }} alignItems="center" mr={6}>
          <Text>Performance</Text>
        </Box>
      </Link>

      {/* leaderboard navigation */}
      <Link href="/leaderboard" style={linkStyle}>
        <Box display={{ base: "none", md: "flex" }} alignItems="center" mr={6}>
          <Text>Leaderboard</Text>
        </Box>
      </Link>

      {/* uploading questions navigation */}
      {userInfo.isTeacher && 
      
        <Link href="/uploadQuestion" style={linkStyle}>
          <Box display={{ base: "none", md: "flex" }} alignItems="center" mr={6}>
            <Text>Upload</Text>
          </Box>
        </Link>
      }
      
      <Spacer />
      {/* profile navigation */}
      <Link href="/profile" style={linkStyle}>
        <Box display={{ base: "none", md: "flex" }} alignItems="center" mr={4}>
          {/* <Avatar size="sm" name={user.name} /> */}
          <Avatar size="sm" src="https://bit.ly/broken-link" bg='teal.500' />
          {/* <Text ml={2}>Profile</Text> */}
        </Box>
      </Link>
    </Flex>
  );
};

export default Navbar;
