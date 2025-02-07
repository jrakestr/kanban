// Parameter: Authorization
// Format: Bearer ${token}


import { Outlet } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Navbar from './components/Navbar';

function App() {

  return (
    <DndProvider backend={HTML5Backend}>
      <div className='container'>
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </DndProvider>
  )
}

export default App
