import { BsArrowRight } from "react-icons/bs";
import Link from "next/link";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
function Hero() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size={"xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How do you want to try me??</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="modal-content">
              <img src="/images/Shrug-bro.svg" alt="" />

              <div className="modal-buttons">
                <Link href="/single">Single</Link>
                <Link href="/multiple">Multiple</Link>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <div className="hero">
        {/* <img src="/images/star.png" className="star" alt="" /> */}
        <img src="/images/avatar.png" className="avatar" alt="" />

        <p className="hero-title">EduAid</p>
        <p className="hero-text">
          EduAid's revolutionary Student Prediction Algorithm is like having a
          personal mentor in your pocket! Whether you're uploading past performance
          data or taking a quick assessment within the app, it effortlessly guides
          you towards academic success. Say goodbye to uncertainty and hello to
           confident decision-making with EduAid.
        </p>
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            onOpen();
          }}
        >
          Try Me
        </a>
        <div className="image-grid">
          <div>
            <img src="/images/bad-student.jpeg" alt="girls" />
            <p>Bad Student</p>
          </div>
          <BsArrowRight size={100} className="arrow" />
          <div>
            <img src="/images/good-student.jpeg" alt="girl" />
            <p>Good Student</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;
