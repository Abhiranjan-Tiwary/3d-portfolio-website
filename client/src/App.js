import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import Hero from "./components/sections/Hero";
import Skills from "./components/sections/Skills";
import Experience from "./components/sections/Experience";
import Education from "./components/sections/Education";
import StartCanvas from "./components/canvas/Stars";
import Projects from "./components/sections/Projects";
import Certificates from "./components/sections/Certificates";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import { Helmet } from "react-helmet";
import Chatbot from "./components/Chatbot";

const Body = styled.div`
  background-color: ${({ theme }) => theme.bg};
  width: 100%;
  overflow-x: hidden;
  position: relative;
`;

const Wrapper = styled.div`
  padding-bottom: 100px;
  background: linear-gradient(
      38.73deg,
      rgba(204, 0, 187, 0.15) 0%,
      rgba(201, 32, 184, 0) 50%
    ),
    linear-gradient(
      141.27deg,
      rgba(0, 70, 209, 0) 50%,
      rgba(0, 70, 209, 0.15) 100%
    );
  width: 100%;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Abhiranjan Tiwary",
  "url": "https://himanshuhaldar.me",
  "image": "https://himanshuhaldar.me/assets/preview.jpg",
  "jobTitle": "Full Stack Developer",
  "worksFor": {
    "@type": "Organization",
    "name": "Freelancer"
  },
  "sameAs": [
    "https://www.linkedin.com/in/abhiranjan-tiwary/",
    "https://github.com/Abhiranjan-Tiwary",
    "https://x.com/abhiranjan65291"
  ],
  "knowsAbout": ["React", "MERN Stack", "Node.js", "Express.js", "MongoDB", "MySQL", "Git", "GitHUB"],
  "description": "Full-stack developer specializing in MERN Stack."
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      <BrowserRouter>
        <Navbar />
        <Body>
          <StartCanvas />
          <div>
            <Hero />
            <Wrapper>
              <Skills />
              <Experience />
            </Wrapper>
            <Projects />
            <Wrapper>
              <Certificates />
              <Education />
              <Contact />
            </Wrapper>
            <Footer />
          </div>
        </Body>
        <Chatbot />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
