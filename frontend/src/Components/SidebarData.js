import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';
import InfoIcon from '@material-ui/icons/Info';
import StoreIcon from '@material-ui/icons/Store';

export const SidebarData = [
    {
        icon: <HomeIcon />,
        text: 'Home',
        path:'/home',
        actions:[
            {
                text:'Create',
            },
            {
                text:'List',
            },
        ]
    },
    {
        icon:<StoreIcon />,
        text: 'Buying',
        path:'/buying',
    },
    {
        icon: <ListIcon />,
        text: 'List',
        path: '/item',
    },
    {
        icon: <InfoIcon />,
        text: 'About',
        path: '/about',
    },
]