import React from 'react';
import '../App.css';
import {SidebarData} from './SidebarData';
import * as FaIcons from 'react-icons/fa';
import {Link} from 'react-router-dom';


class Sidebar extends React.Component{

    constructor(props){
        super(props)
    }
 


    render(){
        var self = this
        return(
            <>
            <div className='navbar'>
                <Link to='#' className='menu-bars'>
                    <FaIcons.FaBars className={this.props.toggle ? 'logo active' : 'logo'} onClick={()=> this.props.onClick(this.props.toggle)}/>
                </Link>
            </div>
               <nav className={self.props.toggle ? 'nav-menu active' : 'nav-menu'}> 
                <ul className='nav-menu-items' onClick={()=> this.props.onClick(this.props.toggle)}>
                    {SidebarData.map((val, index) =>{
                        return(   
                        <li key={index} className='sidebaritem' id={window.location.pathname === val.link ? "active" : ""} onClick={() => {window.location.pathname = val.link}}>
                            <div id='icon'>
                                {val.icon}
                            </div>

                            <div id='title'>
                                {val.title}
                            </div>

                        </li>
                        );
                    })}
                    </ul>
               </nav>
        </>
            
            
            
        )
    }
}

export default Sidebar