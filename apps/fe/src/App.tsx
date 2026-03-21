import { BrowserRouter , Route  ,Routes} from 'react-router-dom';
import Trigger from './components/Trigger';
 
export default function App() {

  return (
    <div>
      <BrowserRouter>
         <Routes>
            <Route path="/dashboard"  element={<Trigger/>}/>
         </Routes>
      </BrowserRouter>
    </div>
  )
}