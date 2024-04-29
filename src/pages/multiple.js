import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
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
  Text,
  Button,
  Heading,
  useDisclosure,
} from "@chakra-ui/react";
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

const { Dragger } = Upload;

function Multiple() {
  const [currentFile, setCurrentFile] = useState("");
  const [showToast, setShowToast] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [responseData, setResponseData] = useState(null);

  const [selectedTableData, setSelectedTableData] = useState(null);

  const handleViewMore = (data) => {
    setSelectedTableData(data);
    onOpen();
  };
  const processData = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("http://localhost:3000/predict", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const predict = await response.json();
            console.log('The response data', predict);
            setResponseData(predict);
        } else {
            const errorResponse = await response.json();
            console.log("Error:", errorResponse.error);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const props = {
    name: "file",
    multiple: true,
    action: "http://localhost:5000/",
    beforeUpload: () => false,
    onChange(info) {
        setCurrentFile(info.file);
        console.log(currentFile);
        processData(info.file);

    },
    onDrop: async (e) => {
        console.log("Dropped files", e.dataTransfer.files);

        const droppedFiles = e.dataTransfer.files;
        for (let i = 0; i < droppedFiles.length; i++) {
            await processData(droppedFiles[i]); // Wait for processData to finish
        }
        await fetchData(); // Wait for fetchData to finish
    },
};



  useEffect(() => {
    if (currentFile) {
      // download();
    }
  }, [currentFile]);


  useEffect(() => {
    if (showToast) {
      toast({
        title: "Done",
        description: "Your image have been uploaded",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [showToast]);

  const [emailData, setEmailData] = useState({
    email: "",
    message: ""}
    );

  const sendEmail = async (emailAddress) => {
    try {
      const response = await fetch("http://localhost:3000/send-email", {
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


  return (
    <div className="single-parent">
      <div className="left">
        <div className="single">
          <p className="title">Multiple Student</p>
          <div className="info">
            <BsFillInfoCircleFill size={30} />
            <p>
              Click or drag an excel file in to the box below to Predict
            </p>
          </div>
          <div className="dragger">
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for multiple file uploads.
              </p>
            </Dragger>
          </div>


          <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Student Prediction Result</ModalHeader>
              <ModalCloseButton />
              {selectedTableData && (                <ModalBody>
                  <Box style={{ display: 'flex', gap: '200px' }}>
                    <Box>
                      <Heading size='xs'>
                        Index Number
                      </Heading>
                      <Text pt='2' fontSize='sm'>
                        {selectedTableData.index}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size='xs'>
                        Email
                      </Heading>
                      <Text pt='2' fontSize='sm'>
                        {selectedTableData.email}
                        </Text>
                    </Box>
                  </Box>
                  <Box style={{ display: 'flex', gap: '247px' }}>
                    <Box>
                      <Heading size='xs'>
                        Gender
                      </Heading>
                      <Text pt='2' fontSize='sm'>
                      {selectedTableData.gender === 0 ? "Male" : selectedTableData.gender === 1 ? "Female" : selectedTableData.gender}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size='xs'>
                        Level
                      </Heading>
                      <Text pt='2' fontSize='sm'>
                        {selectedTableData.level}
                      </Text>
                    </Box>
                  </Box>
                  <Box style={{ display: 'flex', gap: '163px' }}>
                    <Box>
                      <Heading size='xs'>
                        Internet Availability
                      </Heading>
                      <Text pt='2' fontSize='sm'>
                        {selectedTableData.internet_availability === 0 ? "Bad" : selectedTableData.internet_availability === 1 ? "Normal" : selectedTableData.internet_availability === 2 ? "Good" : selectedTableData.internet_availability === 3 ? "Stable" : selectedTableData.internet_availability}
                      </Text>
                    </Box>
                    <Box>
                      <Heading size='xs'>
                        GPA Score
                      </Heading>
                      <Text pt='2' fontSize='sm'>
                       {selectedTableData.gpa_score}
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
                          {selectedTableData.class_mode}
                        </Text>
                      </Box>
                      <Box>
                        <Heading size='xs'>
                          Study Mode
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                        {selectedTableData.study_mode === 0 ? "Online Resources" : selectedTableData.study_mode === 1 ? "Lecture Notes" : selectedTableData.study_mode === 2 ? "Personal Notes" : selectedTableData.study_mode === 3 ? "Forums" : selectedTableData.study_mode}
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
                        {selectedTableData.message}
                      </Text>
                    </Box>
                    <Button colorScheme='blue' href=""
                      onClick={(e) => {
                        setEmailData({
                          email: selectedTableData.email,
                          message: selectedTableData.message
                      });
                        console.log("The email data", emailData);
                        e.preventDefault();
                        onOpen();
                      }}>Send Email</Button>
                  </Stack>
                </ModalBody>
          )}

            </ModalContent>
          </Modal>

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
                    <Td>
                      <Button colorScheme='blue' onClick={() => handleViewMore(data)}>
                        View More</Button></Td>
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

export default Multiple;
