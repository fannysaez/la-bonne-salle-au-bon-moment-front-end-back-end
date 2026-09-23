import './App.css'
import { BrowserRouter } from 'react-router'
import AppRoutes from './AppRoutes'
import UserProvider from './providers/UserProvider'
import {ReservationProvider} from './context/ReservationProvider'
import RoomProvider from './providers/RoomProvider'

function App() {

  return (
    <>
      <UserProvider>
        <RoomProvider>
        <ReservationProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        </ReservationProvider>
        </RoomProvider>
      </UserProvider>
    </>
  )
}

export default App;
