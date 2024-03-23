import React, { useEffect, useState } from "react";
import Compressor from "compressorjs";
import { useToast, VStack, FormControl, FormLabel, Input, Textarea, Button } from "@chakra-ui/react";

import mixpanel from "mixpanel-browser";
mixpanel.init("c2d2405209ce3c42e4f2953c6859580a");
import { message, Upload } from "antd";
import { BsFillInfoCircleFill } from "react-icons/bs";


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


  const fetchData = async () => {
    try {
      const { gender, shape } = await processData(currentFile);
      const response = await fetch("http://localhost:5000/api/filter/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender: gender,
          shape: shape,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);

        // Extract and log the URLs from the API response
        const imageUrls = data.map(item => item.url);
        // console.log("API Response URLs:", imageUrls);
        setImages(imageUrls)
      } else {
        console.log("API Request Failed");
      }
    } catch (error) {
      console.error("API Request Error:", error);
    }
  };

  // processData();
  // fetchData();

  const [isActive, setIsActive] = useState(false);

  const videoConstraints = {
    facingMode: 'user',
  };

  const toggleWebcam = async () => {
    setIsActive(!isActive);
    const cameraDataResponse = await fetchCameraData();
    setCameraData(cameraDataResponse);
    const { gender, shape } = cameraDataResponse;
    setGender(gender);
    setShape(shape);
    await fetchData();
  };

  const props = {
    name: "file",
    multiple: false,
    action: "http://localhost:3000/",
    beforeUpload: () => false,
    onChange(info) {
      if (currentFile) {
        message.success(`${info.file.name} file removed successfully.`);
      } else {
        message.success(`${info.file.name} file uploaded successfully.`);
        setCurrentFile(info.file);
      }
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
      const droppedFiles = e.dataTransfer.files;
      for (let i = 0; i < droppedFiles.length; i++) {
        processData(droppedFiles[i]);
      }
      fetchData()
    },
  };
  const onChange = (e) => {
    setQuality(e / 100);
  };
  const download = (e) => {
    e.preventDefault();
    new Compressor(currentFile, {
      quality: quality,

      success(result) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          return window.navigator.msSaveOrOpenBlob(result);
        } else {
          const data = window.URL.createObjectURL(result);
          const link = document.createElement("a");
          link.href = data;
          link.download = `${currentFile.name}`;
          document.body.appendChild(link);
          link.click();
          toast({
            title: "Compressed image downloaded",
            description: `Size of compressed image is ${(
              result.size /
              1024 /
              1024
            ).toFixed(3)} MB`,
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          mixpanel.track("single compression");
        }
      },
      error(err) {
        console.log(err.message);
        if (
          err.message === "The first argument must be a File or Blob object."
        ) {
          toast({
            title: "Please upload your image",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      },
    });
  };

  return (
    <div className="single-parent">
      <div className="left">
        <div className="single">
          <p className="title">Single Student</p>

          <div className="info">
            <BsFillInfoCircleFill size={30} />
            <p>
              Enter your details for Prediction
            </p>
          </div>

          <div>
            <form>
              <VStack spacing={4}>
                <FormControl>
                  <Input
                    type="text"
                    id="hs-firstname-contacts-1"
                    placeholder="Index Number"
                    borderRadius="lg"
                  />
                </FormControl>
                <FormControl>
                  <Input
                    type="email"
                    id="hs-firstname-contacts-1"
                    placeholder="Email"
                    borderRadius="lg"
                  />
                </FormControl>

                <FormControl>
                  <Input
                    type="text"
                    id="hs-firstname-contacts-1"
                    placeholder="Gender"
                    borderRadius="lg"
                  />
                </FormControl>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <FormControl>
                    <Input
                      type="text"
                      id="hs-firstname-contacts-1"
                      placeholder="Level"
                      borderRadius="lg"
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      type="text"
                      id="hs-firstname-contacts-1"
                      placeholder="Internet Availability"
                      borderRadius="lg"
                    />
                  </FormControl>
                </div>

                <FormControl>
                  <Input
                    type="text"
                    id="hs-firstname-contacts-1"
                    placeholder="GPA Score"
                    borderRadius="lg"
                  />
                </FormControl>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <FormControl>
                    <Input
                      type="text"
                      id="hs-firstname-contacts-1"
                      placeholder="Class Mode"
                      borderRadius="lg"
                    />
                  </FormControl>

                  <FormControl>
                    <Input
                      type="text"
                      id="hs-firstname-contacts-2"
                      placeholder="Study Mode"
                      borderRadius="lg"
                      width='auto'

                    />
                  </FormControl>
                </div>

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
            {/* <LoadingBar /> */}
          </div>
        </div>
      </div>
      <div className="right">
        <div className="big-card">
          <div className="image-gallery">
          </div>
        </div>
      </div>
    </div>
  );
}

export default Single;
