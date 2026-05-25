import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CandidateList from './CandidateList';
import TrialMatchDetail from './TrialMatch';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CandidateList />} />
        <Route path="/patient/:id" element={<TrialMatchDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
