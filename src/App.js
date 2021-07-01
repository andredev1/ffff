import React, { useState, useEffect, useRef } from "react";
import Dashboard from "./components/Dashboard";
import { formatData } from "./utils";
import "./styles.css";
import { CSVLink, CSVDownload } from "react-csv";
import { macd, sma } from "technicalindicators";


export default function App() {
  const [currencies, setcurrencies] = useState([]);
  const [pair, setpair] = useState("");
  const [price, setprice] = useState("0.00");
  //var [priceSMA, setpriceSMA] = useState("");
  const [priceOBV, setpriceOBV] = useState({});
  const [pastData, setpastData] = useState({});
  const [csvdata, setcsvdata] = useState({});
  const ws = useRef(null);
  var printarray=[];
  var ssma=useState([]);
  var macdarray=[];
  const [macdarray2, setmacd2] = useState({});

  let first = useRef(false);
  const url = "https://api.pro.coinbase.com";

  useEffect(() => {
    ws.current = new WebSocket("wss://ws-feed.pro.coinbase.com");

    let pairs = [];

    const apiCall = async () => {
      await fetch(url + "/products")
        .then((res) => res.json())
        .then((data) => (pairs = data));
      
      let filtered = pairs.filter((pair) => {
        if (pair.quote_currency === "USDT") {
          return pair;
        }
      });

      filtered = filtered.sort((a, b) => {
        if (a.base_currency < b.base_currency) {
          return -1;
        }
        if (a.base_currency > b.base_currency) {
          return 1;
        }
        return 0;
      });

      
      setcurrencies(filtered);

      first.current = true;
    };

    apiCall();
  }, []);

  useEffect(() => {
    if (!first.current) {
      
      return;
    }

    
    let msg = {
      type: "subscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
    let jsonMsg = JSON.stringify(msg);
    ws.current.send(jsonMsg);




    
    let historicalDataURL = `${url}/products/${pair}/candles?granularity=86400`;
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));
      
      let formattedData = formatData(dataArr);
      setpastData(formattedData);
     // setpriceSMA(sma(pastData))
     // setpriceOBV(macd(pastData))
      setcsvdata(dataArr)
     let col2 = [];
     for (let i=0;i<dataArr.length;i++){
      let val = dataArr[i][2];
      col2.push(val);
    }
      
      var MACD = require('technicalindicators').MACD;
      var macdInput = {
      values            : col2,
      fastPeriod        : 12,
      slowPeriod        : 26,
      signalPeriod      :  9,
      SimpleMAOscillator: false,
      SimpleMASignal    : false
    }

macdarray=MACD.calculate(macdInput);

for (let i=0;i<macdarray.length;i++){
  let date = new Date(dataArr[i][0] * 1000);

  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let final = `${hour}:${minute}:${second}__${day}-${month}-${year}`;
  macdarray[i]["date"]=final;
  macdarray[i]["closing"]=dataArr[i][2];
}
console.log("done");
setmacd2(macdarray)
 
    };

fetchHistoricalData();

    ws.current.onmessage = (e) => {
      let data = JSON.parse(e.data);
      if (data.type !== "ticker") {
        return;
      }

      if (data.product_id === pair) {
        setprice(data.price);
      }
    };
  }, [pair]);

  const handleSelect = (e) => {
    let unsubMsg = {
      type: "unsubscribe",
      product_ids: [pair],
      channels: ["ticker"]
    };
    let unsub = JSON.stringify(unsubMsg);

    ws.current.send(unsub);

    setpair(e.target.value);
  };
  
  
  let csv=[];
  if(Object.keys(macdarray2).length>0){
    csv.push(<CSVLink data={macdarray2}>Download CSV</CSVLink>);
  }



  return (
    <div className="container">
      {
        <select name="currency" value={pair} onChange={handleSelect}>
          {currencies.map((cur, idx) => {
            return (
              <option key={idx} value={cur.id}>
                {cur.display_name}
              </option>
            );
          })}
        </select>
      }
      {csv}
      <Dashboard price={price} data={pastData} />
      {printarray}
      <Dashboard price={price} data={pastData} />

      obv macd crossing 
      slippage indicators
      

    </div>
  );
}
