import React, { useEffect, useState } from "react";
import { Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import { useToast, VStack, FormControl, FormLabel, Input, Button, Text } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Stack,
  StackDivider,
  Box,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";

import mixpanel from "mixpanel-browser";
mixpanel.init("c2d2405209ce3c42e4f2953c6859580a");
import {
  Table,
  Thead,
  Tbody,
  Select,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'

function Single() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();


  const [responseData, setResponseData] = useState(null);
  const fetchCameraData = async () => {
    try {
      const response = await fetch("http://localhost:5001/predict/s", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          index: formData.indexNumber,
          email: formData.email,
          gender: parseInt(formData.gender),
          level: formData.level,
          gpa_score: formData.gpaScore,
          class_mode: formData.classMode,
          study_mode: parseInt(formData.studyMode),
          internet_availability: parseInt(formData.internetAvailability),
        })
      });

      if (response.ok) {
        const data = await response.json();

        setResponseData(data);
        console.log('The response data', responseData);
      } else {
        console.log("API Request Failed");
      }
    } catch (error) {
      console.error("API Request Error:", error);
    }
  }


//   const sendEmail = async (emailAddress) => {
//     try {
//       const response = await fetch("/send-email", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ email: emailAddress })
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log(data.message); // Output success message
//       } else {
//         console.error("Failed to send email");
//       }
//     } catch (error) {
//       console.error("Error sending email:", error);
//     }
//   };

// sendEmail()

  const [formData, setFormData] = useState({
    indexNumber: "",
    email: "",
    gender: "",
    level: "",
    gpaScore: "",
    classMode: "",
    studyMode: "",
    internetAvailability: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [emailData, setEmailData] = useState({
    email: "",
    message: ""}
    );

  const sendEmail = async (emailAddress) => {
    try {
      const response = await fetch("http://localhost:5001/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: emailAddress.email, message: emailAddress.message})
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.message); // Output success message
      } else {
        console.error("Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  sendEmail(emailData)

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      await fetchCameraData();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };


  return (
    <div className="single-parent">
      <div className="left">
        <div className="single">
          <p className="title">The Single Student</p>

          <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Student Prediction Result</ModalHeader>
              <ModalCloseButton />
              {Array.isArray(responseData) && responseData.map((data, index) => (
                <ModalBody>
                  <Box style={{ display: 'flex', gap: '200px' }}>
                    <Box key={index}>
                      <Heading size='xs'>
                        Index Number
                      </Heading>
                      <Text pt='2' fontSize='sm'>
                        {data.index}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size='xs'>
                        Email
                      </Heading>
                      <Text pt='2' fontSize='sm'>
                        {data.email}
                      </Text>
                    </Box>
                  </Box>
                  <Box style={{ display: 'flex', gap: '247px' }}>
                    <Box>
                      <Heading size='xs'>
                        Gender
                      </Heading>
                      <Text pt='2' fontSize='sm'>
                      {data.gender === 0 ? "Male" : data.gender === 1 ? "Female" : data.gender}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size='xs'>
                        Level
                      </Heading>
                      <Text pt='2' fontSize='sm'>
                        {data.level}
                      </Text>
                    </Box>
                  </Box>
                  <Box style={{ display: 'flex', gap: '163px' }}>
                    <Box>
                      <Heading size='xs'>
                        Internet Availability
                      </Heading>
                      <Text pt='2' fontSize='sm'>
                        {data.internet_availability === 0 ? "Bad" : data.internet_availability === 1 ? "Normal" : data.internet_availability === 2 ? "Good" : data.internet_availability === 3 ? "Stable" : data.internet_availability}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size='xs'>
                        GPA Score
                      </Heading>
                      <Text pt='2' fontSize='sm'>
                        {data.gpa_score}
                      </Text>
                    </Box>
                  </Box>
                  <Stack divider={<StackDivider />} spacing='4'>
                    <Box style={{ display: 'flex', gap: '215px' }}>
                      <Box>
                        <Heading size='xs'>
                          Class Mode
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                          {data.class_mode}
                        </Text>
                      </Box>
                      <Box>
                        <Heading size='xs'>
                          Study Mode
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                        {data.study_mode === 0 ? "Online Resources" : data.study_mode === 1 ? "Lecture Notes" : data.study_mode === 2 ? "Personal Notes" : data.study_mode === 3 ? "Forums" : data.study_mode}
                        </Text>
                      </Box>
                    </Box>
                    <Box>
                      <Heading size='xs'>
                      Prediction{' '}
                        <Tag size="sm" colorScheme="blue">
                          <TagLabel>Excellent</TagLabel>
                        </Tag>
                      </Heading>

                      <Text pt='2' fontSize='sm'>
                        {data.message}
                      </Text>
                    </Box>
                    <Button colorScheme='blue' href=""
                      onClick={(e) => {
                        setEmailData({
                          email: data.email,
                          message: data.message
                      });
                      console.log("The email data", emailData);
                        e.preventDefault();
                       }}>Send Email</Button>
                  </Stack>
                </ModalBody>
              ))}

            </ModalContent>
          </Modal>

          <div>
            <form className="forms" onSubmit={handleSubmit}>
              <VStack spacing={3}>
                <FormControl>
                  <FormLabel>Index Number</FormLabel>
                  <Input
                    type="text"
                    name="indexNumber"
                    placeholder="Index Number"
                    borderRadius="lg"
                    onChange={handleChange}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    borderRadius="lg"
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    name="gender"
                    placeholder="Select option"
                    onChange={handleChange}
                  >
                    <option value="0">Male</option>
                    <option value="1">Female</option>
                  </Select>
                </FormControl>

                <FormControl style={{ display: 'flex', gap: '10px' }}>
                  <FormControl>
                    <FormLabel>Level</FormLabel>
                    <Select
                      name="level"
                      placeholder="Select option"
                      onChange={handleChange}
                    >
                      <option value="L400">L400</option>
                      <option value="L300">L300</option>
                      <option value="L200">L200</option>
                      <option value="L100">L100</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Internet Availability</FormLabel>
                    <Select
                      type="text"
                      name="internetAvailability"
                      placeholder="Select Option"
                      borderRadius="lg"
                      onChange={handleChange}
                    >
                      <option value="0">Bad</option>
                      <option value="1">Normal</option>
                      <option value="2">Good</option>
                      <option value="3">Stable</option>
                    </Select>
                  </FormControl>
                </FormControl>

                <FormControl>
                  <FormLabel>GPA Score</FormLabel>
                  <Input
                    type="decimal"
                    name="gpaScore"
                    placeholder="Enter your GPA Score"
                    borderRadius="lg"
                    onChange={handleChange}
                  />
                </FormControl>

                <FormControl style={{ display: 'flex', gap: '10px' }}>
                  <FormControl>
                    <FormLabel>Class Mode</FormLabel>
                    <Select
                      name="classMode"
                      placeholder="Select option"
                      onChange={handleChange}
                      borderRadius="lg"
                      width='auto'
                    >
                      <option value="LMS">LMS</option>
                      <option value="Class Room">Class Room</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Study Mode</FormLabel>
                    <Select
                      type="text"
                      name="studyMode"
                      placeholder="Study Mode"
                      borderRadius="lg"
                      onChange={handleChange}
                      width='auto'
                    >
                      <option value="1">Online Resources</option>
                      <option value="0">Lecture Notes</option>
                      <option value="2">Personal Notes</option>
                      <option value="3">Forums</option>
                    </Select>
                  </FormControl>
                </FormControl>

                <Button
                  type="submit"
                  w="full"
                  py={3}
                  px={4}
                  colorScheme="blue"
                  fontSize="sm"
                  fontWeight="semibold"
                  rounded="lg"
                  _hover={{ bg: "blue.700" }}
                  disabled={false}
                >
                  Predict
                </Button>
              </VStack>
            </form>

          </div>

          <div>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="big-card">
          <TableContainer>
            <Table variant='striped' colorScheme='blue'>
              <TableCaption>Imperial to metric conversion factors</TableCaption>
              <Thead>
                <Tr>
                  <Th>Index</Th>
                  <Th>Email</Th>
                  <Th>Gender</Th>
                  <Th>Level</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Array.isArray(responseData) && responseData.map((data, index) => (
                  <Tr key={index}>
                    <Td>{data.index}</Td>
                    <Td>{data.email}</Td>
                    <Td>{data.gender === 0 ? "Male" : data.gender === 1 ? "Female" : data.gender}</Td> {/* Modify this line */}
                    <Td>{data.level}</Td>
                    <Td><Button key={data.index} colorScheme='blue' onClick={(e) => {
                      e.preventDefault();
                      onOpen();
                    }}>View More</Button></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

        </div>
      </div>
    </div>
  );
}

export default Single;
