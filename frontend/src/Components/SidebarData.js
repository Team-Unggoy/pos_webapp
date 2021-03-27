import React from 'react';
import HomeIcon from '@material-ui/icons/Home';
import ListIcon from '@material-ui/icons/List';
import InfoIcon from '@material-ui/icons/Info';
import StoreIcon from '@material-ui/icons/Store';
import ComputerIcon from '@material-ui/icons/Computer';
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';

export const SidebarData = [
    {
        icon: <HomeIcon />,
        text: 'Home',
        path:'/home',
    },
    {
        icon:<StoreIcon />,
        text: 'Buying',
        path:'/buying',
    },
    {
        icon: <ListIcon />,
        text: 'Item',
        path: '/item',
    },
    {
        icon: <LocalGroceryStoreIcon/>,
        text: 'Receive',
        path: '/receive',
    },
    {
        icon: <ComputerIcon />,
        text: 'POS',
        path: '/pos',
    },
    {
        icon: <InfoIcon />,
        text: 'About',
        path: '/about',
    },
]