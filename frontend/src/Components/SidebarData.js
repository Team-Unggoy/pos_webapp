import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';
import InfoIcon from '@material-ui/icons/Info';
import StoreIcon from '@material-ui/icons/Store';

export const SidebarData = [
    {
        icon: <HomeIcon />,
        link:'/home',
    },
    {
        icon:<StoreIcon />,
        link:'/buying',
    },
    {
        icon: <ListIcon />,
        link: '/item',
    },
    {
        icon: <InfoIcon />,
        link: '/about',
    },
]