import React, {useState, useEffect} from 'react'
import {AppBar, Box, Toolbar, Avatar, Typography, Grid, IconButton, Button, Tooltip, Menu, MenuItem, ListItemIcon, ListItemText} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';
import { useRouter } from 'next/router'
import {grabImage, createURL} from './sanityClient';
import MenuIcon from '@mui/icons-material/Menu';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import FolderIcon from '@mui/icons-material/Folder';

const menuItems = [
    {
        title: 'Projects',
        url: '/projects',
        icon: <DesignServicesIcon style= {{color: '#2e201f'}} />
    },
    {
        title: 'Documents',
        url: '/documents',
        icon: <FolderIcon style= {{color: '#2e201f'}} />
    }
]

  
const Navbar = () => {
    const [result, setResult] = useState([]);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        async function call() {
            const res = await fetch(createURL("link"));
            setResult(await res.json());
        }
        call();
    }, [])
    let links = result.result;
    const currloc = useRouter().pathname;
    return (
        <Box sx = {{flexGrow: 1, }}>
            <AppBar position = "relative" style = {{background: '#F5F5DC'}} >
                <Grid container component = {Toolbar} justifyContent='space-between' alignItems='center'> 
                    <Grid className="menu-button" item xs ={1} sm ={1} md = {4} lg = {5} justifyContent = 'right' align = 'right'>
                        <IconButton onClick={handleClick}>
                            <MenuIcon style= {{color: '#2e201f'}}/>
                        </IconButton>
                    </Grid>
                    <Grid xs ={1} sm ={1} md = {4} lg = {5} item justifyContent = 'left' align = 'left'>
                        <Link href = '/'>
                        <IconButton
                            size='large'
                            edge="start"
                        >
                            <HomeIcon style= {{color: '#2e201f'}}/>
                        </IconButton>
                        </Link>
                    </Grid>
                    <Grid className = "navbar-items" item xs = {11} sm = {11} md = {8} lg = {5}>
                        <Grid container justifyContent = "flex-end" spacing = {2}>
                            {menuItems.map((x, key) => (
                                <Grid key = {key} xs={3} sm ={3} item align = 'center' style={{display: 'flex', alignItems: 'center'}} >
                                    <Link href={x.url} color="secondary">
                                        <Button key={x.title} style={{ borderRadius: "10px" }} >
                                            <Typography textTransform='capitalize' variant='h6' color='#2e201f' sx={{ fontWeight: 550, fontSize: '1rem' }}>{x.title}</Typography>
                                        </Button>
                                    </Link>
                                </Grid>
                            ))}
                            {
                                links && links.map((link, key) => {
                                    return (
                                        <Grid item key={key}>
                                            <Tooltip title={link.title}>
                                                <IconButton onClick={() => window.open(link.url)}>
                                                    <Avatar style={{width: '1.75rem', height: '1.75rem'}} src={grabImage(link.picture.asset)}/>
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                style={{backgroundColor: '#2e201f50'}}
                MenuListProps={{style: {padding: 0}}}
                >
                    {
                        menuItems.map((item, key) => {
                            return (
                                <Link href={item.url} key={key} style={{textDecoration: 'none'}}>
                                    <MenuItem  style={{backgroundColor: '#F5F5DC'}}>
                                        <ListItemIcon>
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText>
                                            {item.title}
                                        </ListItemText>
                                    </MenuItem>
                                </Link>
                            )
                        })
                    }
                    {
                    links && links.map((link, key) => {
                        return (
                            <MenuItem key={key} onClick={() => window.open(link.url)} style={{backgroundColor: '#F5F5DC'}}>
                                <ListItemIcon>
                                    <Avatar style={{width: '1.25rem', height: '1.25rem'}} src={grabImage(link.picture.asset)}/>
                                </ListItemIcon>
                                <ListItemText>
                                    {link.title}
                                </ListItemText>
                            </MenuItem>
                        )
                    })
                    }
                </Menu>
            </AppBar>
        </Box>
        
    )
}

export default Navbar