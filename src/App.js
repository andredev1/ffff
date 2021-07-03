import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import React, { useState, useEffect, useRef } from "react";
import Dashboard from "./components/Dashboard";
import { formatData } from "./utils";
import { formatmacdData } from "./formatmacd";
import "./styles.css";
import 'devextreme/dist/css/dx.light.css';
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
  const [macdarray3, setmacd3] = useState({});
  const [refresh, setrefresh] = useState(0);
  const opts = {
    tooltips: {
      intersect: true,
      mode: "index"
    },
    responsive: true,
    maintainAspectRatio: false
  };

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
        if (pair.quote_currency === "USD") {
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


  let historicalDataURL = `${url}/products/${pair}/candles?granularity=60`;
    const fetchHistoricalData = async () => {
      let dataArr = [];
      await fetch(historicalDataURL)
        .then((res) => res.json())
        .then((data) => (dataArr = data));
      
      let formattedData = formatData(dataArr);
      
      setpastData(formattedData);
     // setpriceSMA(sma(pastData))
     // setpriceOBV(macd(pastData))
      
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
  let milliseconds = date.getMilliseconds();

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  let final = `${hour}:${minute}:${second}:${milliseconds}__${day}-${month}-${year}`;
  macdarray[i]["date"]=final;
  macdarray[i]["col1"]=dataArr[i][2];
  macdarray[i]["col2"]=dataArr[i][3];
  macdarray[i]["col3"]=dataArr[i][4];
  macdarray[i]["col4"]=dataArr[i][5];
}
console.log("done");
let macd=formatmacdData(macdarray);
setmacd3(macd)
setmacd2(macdarray)


 
    };


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

  useEffect(() => {
    
    const refreshCall = () => {
      if(pair!==""){
        fetchHistoricalData();
      }
      setTimeout(function(){ 
        
        setrefresh((new Date()).getTime()); }
        , 5000);
    };

    refreshCall();
  }, [refresh]);


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
      <Dashboard price={price} data={macdarray3} />



      obv macd crossing 
      slippage indicators
      

    </div>
  );
}
