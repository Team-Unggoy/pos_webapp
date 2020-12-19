import './App.css';
import Sidebar from './Components/Sidebar'
import Item from './Pages/Item'
import About from './Pages/About'
import Home from './Pages/Home'
import React from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'

class App extends React.Component{
  constructor(){
    super()
    this.state ={
      toggle:false,

    }
    this.showHideSideBar = this.showHideSideBar.bind(this)
  }

  showHideSideBar(toggle){
    console.log(toggle)
    this.setState(prevState => {
        return{
         
            toggle:!prevState.toggle
        }
    })

}


  render(){
    return(
        <div className='App'>

      <Router>
        <Sidebar onClick={this.showHideSideBar} toggle={this.state.toggle}/>
        <Switch>
          <Route path='/home'  exact component={Home}/>
          <Route path='/item' render={(props) => (<Item {...props} toggle={this.state.toggle}/>)}/>
          <Route path='/about' exact component={About}/>

        </Switch>

      </Router>
        
        </div>
    )
  }
}

export default App;
