
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import OTTTable from './OttTable';
import MovieForm from './MovieForm';
import MoviesList from './MoviesList';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/create" element={<MovieForm />} />
        <Route path="/create/:id" element={<MovieForm />} />
        <Route path="/" element={<MoviesList />} />
        <Route path="/ottTable" element={<OTTTable />} />
      </Routes>
    </div>
  );
}

export default App;
