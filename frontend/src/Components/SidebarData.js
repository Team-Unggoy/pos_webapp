import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';
import InfoIcon from '@material-ui/icons/Info';

export const SidebarData = [
    {
        title: 'Home',
        icon: <HomeIcon />,
        link:'/home',
    },
    {
        title: 'Item',
        icon: <ListIcon />,
        link: '/item',
    },
    {
        title: 'About',
        icon: <InfoIcon />,
        link: '/about',
    },
]