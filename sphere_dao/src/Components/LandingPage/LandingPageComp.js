import React from 'react';
import { Container, Navbar, Button } from 'react-bootstrap';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import TextShpere from '../TextSphere/TextSphereComp';

const LandingPage = () => {
  return (
    <div className="landing-page">
      
      <Container>
        <div className="content">
          
          <h1>Welcome to SphereDAO 🌎</h1>
          <h3>Only Community Approved Quality Content</h3>
          
          <p>
            Building a clean, fair, and democratic community to share quality content.<br></br>
            We are committed provide a Bot and fake profiles free social community for you and your loved ones.<br></br>
            SphereDAO is a Decentralized Autonomous Organization to create content in the interest of community and earn rewards in.<br></br>
            Creator creates a content and validators approve it to be shown on everyone's feed.<br></br>
            If your content is good enough and following DAO guidlines, you and your validators will earn reward in the proportion of your staking.<br></br>
            Beware!!! If you uploads any post violation community guidelines, you will have to face penalty, deducted from you stake.<br></br>
            Enjoy seamless experience of quality content approved by majority of your own community fellows.
          </p>
          
        </div>
      </Container>
      <TextShpere></TextShpere>
    </div>
  );
};

export default LandingPage;
