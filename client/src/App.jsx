import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Compiler from './pages/Compiler';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Compiler />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;