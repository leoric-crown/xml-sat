import React from 'react';
import FacturasReader from './components/FacturasReader';
import ZipReader from './components/ZipReader'
import Upload from './components/upload/Upload'


function App() {
  return (
    <React.Fragment>
      <FacturasReader/>
      <ZipReader/>
      <Upload/>
    </React.Fragment>
  );
}

export default App;
