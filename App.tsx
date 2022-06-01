// https://www.ag-grid.com/react-data-grid/getting-started/
// STACKBLITZ: https://stackblitz.com/edit/react-ts-qtrasn?file=index.html,index.tsx,App.tsx
//CODESANDBOX: https://codesandbox.io/s/ag-grid-demo-f1q950?file=/src/App.tsx:23-1403
// https://www.youtube.com/watch?v=Pr__B6HM_s4&list=PLsZlhayVgqNwHNHeqpCkSgdRV08xrKtzW
// https://mui.com/
import * as React from 'react';
import './style.css';

import { AgGridReact } from 'ag-grid-react';
import { DataGrid } from '@mui/x-data-grid';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Button from '@mui/material/Button';

export default function App() {
  const gridRef = useRef(); // Optional - for accessing Grid's API
  const [rowData, setRowData] = useState([
    { make: 'Ford', model: 'F-150', price: 40000 },
    { make: 'Tesla', model: 'Model 3', price: 50000 },
    { make: 'Hyundai', model: 'Tucson', price: 60000 },
  ]);
  const [columnDefs, setColumnDefs] = useState([
    { field: 'make' },
    { field: 'model' },
    { field: 'price' },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
    }),
    []
  );

  // Example load data from sever
  useEffect(() => {
    fetch('https://www.ag-grid.com/example-assets/row-data.json')
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }, []);

  // Example of consuming Grid Event
  const cellClickedListener = useCallback((event) => {
    console.log('cellClicked', event);
  }, []);

  // Example using Grid's API
  const buttonListener = useCallback((e) => {
    gridRef.current.api.deselectAll();
  }, []);

  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      {/* Example using Grid's API */}
      <Button variant="contained" onClick={buttonListener}>
        Push Me
      </Button>
      <AgGridReact
        onCellClicked={cellClickedListener}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        rowSelection="multiple"
        animateRows={true}
        ref={gridRef}
      />
    </div>
  );
}
