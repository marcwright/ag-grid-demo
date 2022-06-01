// https://www.ag-grid.com/react-data-grid/getting-started/
// STACKBLITZ: https://stackblitz.com/edit/react-ts-qtrasn?file=index.html,index.tsx,App.tsx
//CODESANDBOX: https://codesandbox.io/s/ag-grid-demo-f1q950?file=/src/App.tsx:23-1403
// https://www.youtube.com/watch?v=Pr__B6HM_s4&list=PLsZlhayVgqNwHNHeqpCkSgdRV08xrKtzW
// https://mui.com/
import * as React from 'react';
import './style.css';

import { AgGridReact } from 'ag-grid-react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import Button from '@mui/material/Button';
import BalanceSharpIcon from '@mui/icons-material/BalanceSharp';

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

  // const [socketUrl, setSocketUrl] = useState(
  //   'wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self'
  // );
  // const [messageHistory, setMessageHistory] = useState([]);

  // const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

  // useEffect(() => {
  //   if (lastMessage !== null) {
  //     setMessageHistory((prev) => prev.concat(lastMessage));
  //   }
  // }, [lastMessage, setMessageHistory]);

  // const handleClickChangeSocketUrl = useCallback(
  //   () => setSocketUrl('wss://demos.kaazing.com/echo'),
  //   []
  // );

  // const handleClickSendMessage = useCallback(() => sendMessage('Hello'), []);

  // const connectionStatus = {
  //   [ReadyState.CONNECTING]: 'Connecting',
  //   [ReadyState.OPEN]: 'Open',
  //   [ReadyState.CLOSING]: 'Closing',
  //   [ReadyState.CLOSED]: 'Closed',
  //   [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  // }[readyState];

  // let socket = new WebSocket(
  //   'wss://demo.piesocket.com/v3/channel_1?api_key=VCXCEuvhGcBDP7XhiJJUDvR1e1D3eiVjgZ9VRiaV&notify_self'
  // );

  let socket = new WebSocket('wss://ws.bitstamp.net');
  const subscribeMsg = {
    event: 'bts:subscribe',
    data: {
      channel: 'order_book_btcusd',
    },
  };
  socket.onopen = function (e) {
    console.log('[open] Connection established');
    console.log('Sending to server');
    socket.send(JSON.stringify(subscribeMsg));
  };

  socket.onmessage = function (event) {
    // console.log(`[message] Data received from server: ${event.data}`);
  };

  socket.onclose = function (event) {
    if (event.wasClean) {
      console.log(
        `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
      );
    } else {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      console.log('[close] Connection died');
    }
  };

  socket.onerror = function (error) {
    console.log(`[error] ${error.message}`);
  };

  return (
    <div className="ag-theme-alpine" style={{ height: 500 }}>
      <BalanceSharpIcon />
      {/* <div>
        <button onClick={handleClickChangeSocketUrl}>
          Click Me to change Socket Url
        </button>
        <button
          onClick={handleClickSendMessage}
          disabled={readyState !== ReadyState.OPEN}
        >
          Click Me to send 'Hello'
        </button>
        <span>The WebSocket is currently {connectionStatus}</span>
        {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
        <ul>
          {messageHistory.map((message, idx) => (
            <span key={idx}>{message ? message.data : null}</span>
          ))}
        </ul>
      </div> */}

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
