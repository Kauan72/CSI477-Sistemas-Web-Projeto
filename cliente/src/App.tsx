import './App.css'
import Menu from './componentes/menu/Menu'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div className="app-container">
      <Menu/>
      <div className="content">
        <Outlet/> 
      </div>
    </div>
  )
}

export default App