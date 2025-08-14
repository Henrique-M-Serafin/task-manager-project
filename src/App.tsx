import { StrictMode } from 'react'
import './App.css'
import { TasksProvider } from './context/TaskContext'
import { MainPage } from './pages/MainPage'

function App() {


  return (
    <StrictMode>
      <TasksProvider>
        <MainPage />
      </TasksProvider>
    </StrictMode>
    
  )
}

export default App
