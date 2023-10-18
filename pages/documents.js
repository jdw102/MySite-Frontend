import React, { useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, Slide, Fade, Box, CardMedia, CardContent, Card, Grid, ListItem, Typography, List, CardHeader, ListItemButton, Divider, ListItemText, ListItemSecondaryAction } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createURL, grabFile, grabImage } from '../components/sanityClient';
import SEO from '../components/seo';

export async function getServerSideProps() {
  const documents = await fetch(createURL("files"));
  return {
    props: {
      documents: await documents.json()
    },
  };
}

const documents = ({documents}) => {
  const [data, setData] = useState(documents? grabFile(documents.result[0]): "");
  const [id, setId] = useState(0);
  return (
    <div >
      <SEO pageTitle= "Work Documents - Jerry Worthy's Portfolio" pageDescription= "Browse through a collection of documents showcasing my professional journey."/>
      <Fade in timeout={750}>
        <Card sx={{ display: 'flex', margin: '1rem', backgroundColor: '#e7e7e7', height: '100vh' }}>
            <Grid container>
                <Grid item xs = {12} md ={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                        <CardHeader 
                          title="Files"
                          titleTypographyProps={{variant: 'h4'}}
                          subheader="Click on the items to display the files."
                          />
                          <List>
                            {
                              documents.result.map((doc, key) => {
                                return (
                                  <Slide in direction="up" timeout={1000} key={key}>
                                  <div>
                                  <ListItemButton onClick={() => 
                                    {setData(grabFile(doc))
                                    setId(key);
                                    }} style={{backgroundColor: id === key? "#56526450": '#e7e7e7'}}>
                                    <ListItem>
                                      <ListItemText>
                                        {doc.title}
                                      </ListItemText>
                                    </ListItem>
                                    <div style={{fontFamily: `"Robot", sans-serif`, fontSize: "0.75rem", color: 'gray'}}>
                                      {doc.description}
                                    </div>
                                  </ListItemButton>
                                  <Divider/>
                                  </div>
                                  </ Slide>
                                )
                              })
                            }
                          </List>
                        </CardContent>
                    </Box>
                </Grid>
                <Grid item xs ={12} md = {8} style={{display: 'flex', alignItems: 'center'}}>
                    <CardMedia 
                    component="iframe"
                    height="100%"
                    src={data}
                    />
                </Grid>
            </Grid>
        </Card>
      </Fade>
    </div>
  )
}

export default documents;
