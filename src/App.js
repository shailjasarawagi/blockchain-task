import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import React, { useState } from "react";
import { Table } from 'antd';
import '../src/App.css';
import 'antd/dist/antd.css';
function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [address, setAddress] = useState("")
  const [data, setData] = useState("");

  const web3 = createAlchemyWeb3(
    "wss://polygon-mainnet.g.alchemy.com/v2/IEj1j9qiY2TC8jmcapLwLN4Tm121ue5_",
  );
  const SMART_CONTRACT_ADDRESS = "0xAC18EAB6592F5fF6F9aCf5E0DCE0Df8E49124C06";
  const contractABI = require("./abi.json");
  const testContract = new web3.eth.Contract(
    contractABI,
    SMART_CONTRACT_ADDRESS
  );
  // const newWeb3 = new web3
  const EthDater = require("ethereum-block-by-date");
  const dater = new EthDater(
    web3 // Web3 object, required.
  );

  const get_da = async () => {
    let arr1 = []
    let fromblock = await dater.getDate(
      new Date(from), // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
      true, // Block after, optional. Search for the nearest block before or after the given date. By default true.
      false // Refresh boundaries, optional. Recheck the latest block before request. By default false.
    );

    let toblock = await dater.getDate(
      new Date(to), // Date, required. Any valid moment.js value: string, milliseconds, Date() object, moment() object.
      true, // Block after, optional. Search for the nearest block before or after the given date. By default true.
      false // Refresh boundaries, optional. Recheck the latest block before request. By default false.
    );

    testContract.getPastEvents('CreateStream', {
      filter: { sender: address }, // Using an array means OR: e.g. 20 or 23
      fromBlock: fromblock.block,
      toBlock: toblock.block
    }, function (error, events) { console.log(events); })
      .then(function (events) {
        console.log("ddd", events)
        events.forEach(function (a) {
          arr1.push(a.returnValues);
        });
        setData(arr1)
      });
  }


  const columns = [
    {
      title: 'Stream Id',
      dataIndex: 'streamId',
      key: 'streamId',


    },
    {
      title: 'Sender',
      dataIndex: 'sender',
      key: 'sender',

    },
    {
      title: 'Recepient',
      dataIndex: 'recipient',
      key: 'recipient',

    },
    {
      title: 'Deposit',
      dataIndex: 'deposit',
      key: 'deposit',

    },
    {
      title: 'Token Address',
      dataIndex: 'tokenAddress',
      key: 'tokenAddress',

    },
  ];
  return (
    <>
      <div className="App">
        <div className="activity">
          <div className="heading">Activities</div>

        </div>
        <div className="dropdown">

          <input value={address} onChange={(e) => setAddress(e.currentTarget.value)} className="date" placeholder="Address"></input>
          <input value={from} onChange={(e) => setFrom(e.currentTarget.value)} type="datetime-local" className="date" placeholder="From Date"></input>
          <input value={to} onChange={(e) => setTo(e.currentTarget.value)} type="datetime-local" className="date" placeholder="To Date"></input>

          <button onClick={() => get_da()} className="button">Get</button>
        </div>
        <div className="data">

          <Table dataSource={data ? data : []} columns={columns} scroll={{ x: true }} rowKey={record => record.streamId} className="data" />
        </div>
      </div>

    </>
  );
}

export default App;

