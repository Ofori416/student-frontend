import React, { useEffect, useState } from "react";
import Compressor from "compressorjs";
import { useToast, VStack, FormControl, FormLabel, Input, Textarea, Button } from "@chakra-ui/react";

import mixpanel from "mixpanel-browser";
mixpanel.init("c2d2405209ce3c42e4f2953c6859580a");
import { message, Upload } from "antd";
import { BsFillInfoCircleFill } from "react-icons/bs";
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
  const [currentFile, setCurrentFile] = useState("");
  const [quality, setQuality] = useState(0.5);
  const toast = useToast();
  const [images, setImages] = useState([]);
  const [gender, setGender] = useState("");
  const [shape, setShape] = useState("");
  const [cameraData, setCameraData] = useState(null);


  const fetchCameraData = async () => {
    try {
      const response = await fetch("http://localhost:5000/video_detection");

      if (response.ok) {
        const cameraDataResponse = await response.json();
        setCameraData(cameraDataResponse);
        console.log('Camera Data Response', cameraDataResponse)
        const { gender, shape } = detectionResults;
        setGender(gender);
        setShape(shape);
        return { gender, shape };
      } else {
        console.log("API Request Failed");
      }
    } catch (error) {
      console.error("API Request Error:", error);
    }
  }

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // You can perform additional actions here, such as sending the form data to a server
  };

  return (
    <div className="single-parent">
      <div className="left">
        <div className="single">
          <p className="title">The Single Student</p>

          {/* <div className="info">
            <BsFillInfoCircleFill size={30} />
            <p>
              Enter your details for Prediction
            </p>
          </div> */}

          <div>
            <form className="forms" onSubmit={handleSubmit}>
              <VStack spacing={3}>
                <FormControl>
                  <FormLabel>Index Number</FormLabel>
                  <Input
                    type="text"
                    name="indexNumber"
                    placeholder="First Name"
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
                      <option value="L400">L400</option>
                      <option value="L300">L300</option>
                      <option value="L200">L200</option>
                      <option value="L100">L100</option>
                    </Select>
                  </FormControl>
                </FormControl>

                <FormControl>
                  <FormLabel>GPA Score</FormLabel>
                  <Input
                    type="number"
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
                      <option value="option1">LMS</option>
                      <option value="option2">Class Room</option>
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
                      <option value="option1">Online Resources</option>
                      <option value="option2">Lecture Notes</option>
                      <option value="option3">Personal Notes</option>
                      <option value="option3">Forums</option>
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
                <Tr>
                  <Td>inches</Td>
                  <Td>millimetres (mm)</Td>
                  <Td >25.4</Td>
                  <Td >25.4</Td>
                  <Td ><Button colorScheme='blue'>Button</Button></Td>

                </Tr>
                <Tr>
                  <Td>feet</Td>
                  <Td>centimetres (cm)</Td>
                  <Td >30.48</Td>
                  <Td >25.4</Td>
                  <Td ><Button colorScheme='blue'>Button</Button></Td>

                </Tr>
                <Tr>
                  <Td>yards</Td>
                  <Td>metres (m)</Td>
                  <Td >0.91444</Td>
                  <Td >25.4</Td>
                  <Td ><Button colorScheme='blue'>Button</Button></Td>

                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default Single;
