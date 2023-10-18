import Link from 'next/link';
import React, {useState, useEffect, useRef} from 'react';
import Image from 'next/image';
import {Grid, Button, Card, CardContent, CardMedia, Paper, Avatar, CardHeader, Typography, Slide, Fade, Box, Tooltip} from '@mui/material';
import { createURL, grabImage } from '../components/sanityClient';
import SEO from '../components/seo';

function useWindowSize() {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState({
      width: undefined,
      height: undefined,
    });
  
    useEffect(() => {
      // only execute all the code below in client side
      // Handler to call on window resize
      function handleResize() {
        // Set window width/height to state
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }
      
      // Add event listener
      window.addEventListener("resize", handleResize);
       
      // Call handler right away so state gets updated with initial window size
      handleResize();
      
      // Remove event listener on cleanup
      return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    return windowSize;
  }

export async function getStaticProps() {
  const avatar = await fetch(createURL("avatar"));
  const homepage = await fetch(createURL("homepage"));
  const about = await fetch(createURL("about"));
  const contactPage = await fetch(createURL("contactPage"));
  const contacts = await fetch(createURL("contact"));
  return {
    props: {
      avatar: await avatar.json(), homepage: await homepage.json(), about: await about.json(),
      contactPage: await contactPage.json(), contacts: await contacts.json()
    },
  };
}

const useIntersection = (element, rootMargin) => {
  const [isVisible, setState] = useState(false);

  useEffect(() => {
      const observer = new IntersectionObserver(
          ([entry]) => {
              setState(entry.isIntersecting);
          }, { rootMargin }
      );

      element.current && observer.observe(element.current);

  }, []);

  return isVisible;
};

const Homepage = ({avatar, homepage, contactPage, contacts, about}) =>{
  const aboutRef = useRef(null)
  const contactRef = useRef(null);
  const inViewport = useIntersection(contactRef, '0px');
  const executeScroll = () => aboutRef.current.scrollIntoView()    
  const avatarInfo = {
      name: avatar.result[0].name,
      title: avatar.result[0].title,
      image: grabImage(avatar.result[0].picture.asset)
  }
  const homepageInfo = {
      image: grabImage(homepage.result[0].picture.asset)
  }
  const window = useWindowSize();
  const info = contactPage.result[0];
  const aboutInfo = about.result[0];
  const aboutLines = aboutInfo.description.split('\n');
  const aboutImage = grabImage(aboutInfo.picture.asset);

  return (
    <>
      <div style={{ backgroundImage: `url(${homepageInfo.image})`, backgroundSize: 'cover', backgroundPosition: 'center', height: '91.5vh', boxShadow: "inset 0 0 0 1000px rgba(0,0,0,.3)" }}>
      <SEO pageTitle="Jerry Worthy - Software Engineer and Electrical/Computer Engineer" 
      pageDescription="Welcome to my portfolio website! I'm Jerry Worthy, a passionate software engineer and electrical/computer engineer. Explore my profile, projects, and ways to connect with me via email, LinkedIn, and Handshake."
      />
        <Fade in  timeout={1000}>
              <Button onClick={executeScroll} component = {Card}  sx = {{ position: "absolute", diplay: "flex", top: "25%", left: "20%", backgroundColor: '#565264', borderRadius: "10px", padding: 2, zIndex: '0'}}>
                  <CardContent>
                      <CardMedia style ={{display: "flex", justifyContent: "center"}}>
                          <Avatar src = {avatarInfo.image} sx = {{width: 200, height: 200, border: "5px solid #f5f3f2"}}/>
                      </CardMedia>
                      <Typography variant='h6' color= "#f5f3f2" sx={{ fontFamily: 'monospace', textAlign: "center" }}>
                          {avatarInfo.name}
                      </Typography>
                      <Typography component = {Paper} variant='subtitle1'  sx={{ fontFamily: 'monospace', textAlign: "center", backgroundColor: "#f5f3f2"  }}>
                          {avatarInfo.title}
                      </Typography>
                  </CardContent>
              </Button>
        </Fade>
      </div>
      <div ref= {aboutRef} style={{backgroundColor: "#e7e7e7"}}>
        <Fade in timeout={750}>
          {/* <Card sx={{ display: 'flex', margin: '1rem', backgroundColor: '#565264' }}> */}
              <Grid container alignItems='center'>
                  <Grid item xs = {12} md ={6} style = {{adisplay: 'flex', alignItems: 'center'}}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }} >
                          <CardContent sx={{ flex: '1 0 auto' }}>
                            <h1 className = "header-text" style={{textAlign: 'center'}}>{aboutInfo.title}</h1>
                              <Typography variant="subtitle1" component="div" style ={{paddingLeft: '2rem', paddingRight: '2rem'}}>
                                  {aboutLines.map((line, id) => {
                                      return (
                                          <p key = {id} className='content-text' style={{color: "black"}}>
                                              {line}
                                          </p>   
                                      )                            
                                  })}
                              </Typography>
                          </CardContent>
                      </Box>
                  </Grid>
                  <Grid item xs ={12} md = {6} style={{display: 'flex', alignItems: 'center'}}>
                      <CardMedia
                          component="img"
                          sx={{ width: "100%" }}
                          image={aboutImage}
                          alt="Beach pic"
                      />
                  </Grid>
              </Grid>
          {/* </Card> */}
        </Fade>
      </div>
      <div style={{backgroundColor: "#565264", marginTop: '2.5rem'}} ref= {contactRef} >
        <Grid container sx = {{padding: '1rem'}} spacing = {5} justifyContent = 'center'>
            <Grid item xs = {12} align='center'>
                <h1 variant='h1' className = "header-text" style={{marginBottom: '-1rem', color: '#f5f3f2'}} >
                    {info.title}
                </h1>
                <p ref= {contactRef} className='content-text' style={{color: '#f5f3f2'}}>
                    {info.blurb}
                </p>
            </Grid>
            {
              contacts.result.map((contact, key) => {
                return (
                  <Slide in={inViewport} key={key} direction='right' timeout={1000}>
                    <Grid key = {key} item xs = {12} sm = {4} md = {3}  align = 'center'>
                      <div style = {{justifyContent: 'center', display: 'flex', background: 'transparent', borderRadius:"10px"}}>
                          <CardContent>
                              <CardMedia style = {{display: 'flex', justifyContent: 'center'}}>
                                  <Avatar src={grabImage(contact.picture.asset)} sx={{ width: 140, height:140, backgroundColor: '#3072ff'}} align = 'center' />
                              </CardMedia>
                              <Typography color='#2e201f' variant='h6' sx={{ fontFamily: 'monospace', textAlign: 'center', color: '#f5f3f2' }}>
                                  {contact.title}
                              </Typography>
                              <Typography color='#2e201f' variant = 'body1' sx={{ fontFamily: 'monospace', textAlign: 'center', color: '#f5f3f2' }}>
                                  {
                                    contact.copy == true?
                                    <Tooltip title="Copy to Clipboard">
                                    <span style={{textDecoration: 'underline', cursor: 'pointer'}} onClick = {() => {navigator.clipboard.writeText(contact.url)}}>{contact.text}</span>
                                    </Tooltip>
                                    :
                                    <a href = {contact.url} >{contact.text}</a>
                                  }
                              </Typography>
                          </CardContent>
                        </div>
                    </Grid>
                  </Slide>
                )
              })
            }

          </Grid>
      </div>
    </>
)
}

export default Homepage
