import './App.css';
import Header from './Components/Header'
import Item from './Pages/Item'
import About from './Pages/About'
import Home from './Pages/Home'
import Buying from './Pages/Buying'
import POS from './Pages/POS'
import React from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'

class App extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
        <div className='App'>
      <Router>
      <Header/>
        <Switch>
          <Route path='/home'  exact component={Home}/>
          <Route path='/buying' exact component={Buying}/>
          <Route path='/item' exact component={Item}/>
          <Route path='/pos' exact component={POS}/>
          <Route path='/about' exact component={About}/>
        </Switch>
      </Router>
        
        </div>
    )
  }
}

export default App;
