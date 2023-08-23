import React, {useContext} from 'react'
import { createURL, grabImage } from '../../components/sanityClient';
import { Fade, Card, CardContent, Grid, CardMedia, Typography, Box,
     CardHeader, CardActions, IconButton, Tooltip, Button } from '@mui/material';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export async function getServerSideProps(context) {
    const {id} = context.query;
    const projects = await fetch(createURL("project"));
    const allProjects = await projects.json();
    return {
        props: {
            project: await allProjects.result.filter((proj) => proj._id === id)[0]
        }
    }
}


const project = ({project}) => {
    const carouselItems = [];
    project.images && project.images.map((img, key) => {
        carouselItems.push(<img key = {key} src = {grabImage(img)}  style={{ objectFit: "contain", maxHeight: "90vh", maxWidth: "100%", backgroundColor:'#d1700f50' }} />);
    })
    project.videos && project.videos.map((vid, key) => {
        carouselItems.push(
            <div key={key} style={{ objectFit:'fill' , height: "90vh", width: "100%"}}>
                <iframe src={vid} height="100%" />
            </div>);
    })
  return (
    <Fade in timeout={750}>
        <Card sx={{ display: 'flex', margin: '1rem', backgroundColor: '#F5F5DC' }}>
            <Grid container>
                <Grid item xs = {12} sm ={6}>
                    <div style={{display: 'flex'}}>
                        <div style={{display: 'flex', alignItems: 'center', margin: '0.5rem'}}>
                        <Tooltip title="Go Back">
                            <IconButton onClick={() => history.back()}>
                                <ArrowBackIcon/>
                            </IconButton>
                        </Tooltip>
                        </div>
                        <CardHeader title={project.title} titleTypographyProps={{variant: 'h4', fontSize: '2vmax'}}/>
                    </div>
                    <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                        <CardContent sx={{ display: 'flex', flex: '1 0 auto', alignItems: 'center'}}>
                            <Typography variant="subtitle1" color="text.primary" >
                                {project.description.split('\n').map((line, key) => {
                                    return (
                                        <p style={{marginBottom: '1rem', fontSize: '1.5vmax'}} key={key}>
                                           &nbsp; &nbsp; {line}
                                        </p>
                                    )
                                })}
                            </Typography>
                        </CardContent>
                        <CardActions style={{display: 'flex', justifyContent: 'center'}}>
                            {project.link && 
                                <Button  variant = "contained" style={{backgroundColor: '#d1700fc0'}} onClick={() => window.open(project.link)}>
                                    Visit Project
                                </Button>
                                }
                            </CardActions>
                    </Box>
                </Grid>
                <Grid item xs ={12} sm = {6} style={{display: 'flex', alignItems: 'center'}}>
                    <CardMedia>
                        <Carousel  infiniteLoop={true} showThumbs={false}  >
                            {carouselItems.map((item) => {
                                return (
                                    item
                                )
                            })
                            }
                        </Carousel>
                    </CardMedia>
                </Grid>
            </Grid>
        </Card>
    </Fade>
  )
}

export default project