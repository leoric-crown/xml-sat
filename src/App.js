import React from 'react';
import FacturasReader from './components/FacturasReader';
import ZipReader from './components/ZipReader'


function App() {
  return (
    <React.Fragment>
      <FacturasReader/>
      <ZipReader/>
    </React.Fragment>
  );
}

export default App;
