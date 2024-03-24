import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { InboxOutlined } from "@ant-design/icons";
import { Upload } from "antd";
import { BsFillInfoCircleFill } from "react-icons/bs";
import mixpanel from "mixpanel-browser";
import ImageCard from "./imageCard";
import NothingToShowCard from "./NothingToShowCard";

const { Dragger } = Upload;

function Multiple() {
  const [currentFile, setCurrentFile] = useState("");
  const [quality, setQuality] = useState(0.5);
  const [showToast, setShowToast] = useState(false);
  const [gender, setGender] = useState("");
  const [shape, setShape] = useState("");
  const toast = useToast();
  const [images, setImages] = useState([]);

  const processData = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/image_detection", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const detectionResults = await response.json();
        console.log("Detection Results:", detectionResults);
        const { gender, shape } = detectionResults;
        setGender(gender);
        setShape(shape);
        return { gender, shape };
      } else {
        const errorResponse = await response.json();
        console.log("Error:", errorResponse.error);
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const fetchData = async () => {
    try {
      const { gender, shape } = await processData(currentFile); // Wait for processData to finish
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
        const imageUrls = data.map((item) => item.url);
        // console.log("API Response URLs:", imageUrls);
        setImages(imageUrls);
      } else {
        console.log("API Request Failed");
      }
    } catch (error) {
      console.error("API Request Error:", error);
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



  const onChange = (e) => {
    setQuality(e / 100);
  };


  const download = () => {
    setShowToast(false);
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
          setTimeout(() => {
            setShowToast(true);
            mixpanel.track("multiple compression");
          }, 5000);
        }
      },
      error(err) {
        console.log(err.message);
      },
    });
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

          <div>
          </div>
        </div>
      </div>
      <div className="right">
        <div className="big-card">
          <div className="image-gallery">
            {images.length > 0 ? (
              images.map((imageUrl, index) => (
                <ImageCard key={index} imageUrl={imageUrl} altText={`Image ${index + 1}`} />
              ))
            ) : (
              <div className="nothing-found">
                <NothingToShowCard/>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );


}

export default Multiple;
