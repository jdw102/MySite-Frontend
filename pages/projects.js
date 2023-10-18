import React, {useEffect, useState} from 'react'
import { createURL, grabImage } from '../components/sanityClient';
import { Card, Grid, CardHeader, 
  CardMedia, CardContent, CardActions, 
  Button, Grow, Typography, Chip, TextField, Select,
  FormControl, InputLabel, MenuItem, IconButton, Tooltip
 } from '@mui/material';
import Link from 'next/link';
import SEO from '../components/seo';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';

export async function getServerSideProps() {
  const projects = await fetch(createURL("project"));
  return {
    props: {
      projects: await projects.json()
    },
  };
}


const projects = ({projects}) => {
  const [category, setCategory] = useState("All");
  const [allProjects, setAllProjects] = useState(projects.result);
  const [text, setText] = useState("");
  const handleChange = (e) => {
    setCategory(e.target.value);
  }
  const handleTextChange = (e) => {
    setText(e.target.value);
  }
  const categories = new Set();
  projects.result.forEach((proj) => {
    proj.tags.forEach((tag) => categories.add(tag))
  })

  useEffect(() => {
    if (category === "All"){
      setAllProjects(projects.result.filter((proj) => proj.title.toLowerCase().includes(text.toLowerCase())));
    }
    else{
      setAllProjects(projects.result.filter((proj) => proj.tags.includes(category) && proj.title.toLowerCase().includes(text.toLowerCase())));
    }
  }, [category, text])

  return (
    <div>
      <SEO pageTitle="Projects - Jerry Worthy's Software and ECE Portfolio" pageDescription="Explore a diverse range of projects that highlight my capabilities as a software engineer and electrical/computer engineer."/>
      <Grid container spacing = {4} justifyContent='center' style={{marginLeft: 'auto', marginRight: 'auto', marginTop: '0.2rem', width: "50%"}}>
        <Grid item xs = {12} sm ={4} md = {4} lg ={2}>
          <select
            value={category}
            label="Category"
            onChange={handleChange}
            style={{height: '3rem', width: '100%', backgroundColor: "transparent", color: 'white', borderRadius: '1rem', fontSize: '1rem'}}
          >
            <option value={"All"} style={{height: '3rem', width: '100%', backgroundColor: "#565264", color: 'white', borderRadius: '1rem', fontSize: '1rem'}}>All</option>
            {
              [...categories].map((cat, key) => {
                return (
                  <option key={key} value = {cat} style={{height: '3rem', width: '100%', backgroundColor: "#565264", color: 'white', borderRadius: '1rem', fontSize: '1rem'}}>
                    {cat}
                  </option>
                )
              })
            }
          </select>
        </Grid>
        <Grid item xs = {12} sm = {8} md = {8} lg ={10}>
          <SearchIcon style={{position: "absolute", marginTop: '0.7rem', marginLeft: '0.4rem', color: 'white'}}/>
          <input  id="projectSearch" className = "project-search-bar" onChange={handleTextChange} style={{height: '3rem', width: '100%', backgroundColor: "transparent", color: 'white', borderRadius: '1rem', fontSize: '1rem', paddingLeft: '2rem'}} placeholder='Search projects by title'/>
        </Grid>
      </Grid>
      <Grid container spacing = {3} style = {{padding: '1rem', marginTop: '0.25rem'}} >
        {
          allProjects.map((project, index) => {
            return (
              <Grow key={index} in style={{transitionDelay: `${index * 100}ms`}}>
                <Grid item xs = {12} sm = {6} md = {3}>
                  <Card style={{backgroundColor: '#e7e7e7'}}>
                    <CardHeader 
                    title={project.title}
                    action={project.link && <IconButton onClick={() => window.open(project.link)}>
                              <Tooltip title="Visit Project">
                                <LaunchIcon />
                              </Tooltip>
                            </IconButton>}
                    />
                    <CardMedia
                    component="img"
                    image={project.thumbnail?  grabImage(project.thumbnail): ""}
                    style={{height: 300}}
                    />
                    <CardContent>
                      {
                        project.tags.map((tag, key) => {
                          return (
                            <Chip key={key} label={tag} style={{margin: '0.25rem'}}/>
                          )
                        })
                      }
                      <Typography variant="body1">
                      {project.description.slice(0, 200) + "..."}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Link href={`/project/${project._id}`}>
                        <Button style={{color: '#CD5334ff'}}>
                          Learn More
                        </Button>
                      </Link>
                    </CardActions>
                  </Card>
                </Grid>
              </Grow>
            )
          })
        }
      </Grid>
    </div>
  )
}

export default projects;
