export const formatmacdData = (data) => {
    let finalData = {
      labels: [],
      datasets: [
        {
          label: "MacD",
          data: [],
          backgroundColor: "rgb(255, 0, 0)",
          borderColor: "rgba(255, 0, 0)",
          fill: false
        },
        {
          label: "Signal",
          data: [],
          backgroundColor: "rgb(0, 255,0)",
          borderColor: "rgba(0,255, 0)",
          fill: false
        }
      ]
    };
  
    let dates = data.map((val) => {
      let final = val["date"];
      return final;
    });
  
    let macd = data.map((val) => {
      return val["MACD"];
    });
    let signal = data.map((val) => {
      return val["signal"];
    });
    macd.reverse();
    dates.reverse();
    finalData.labels = dates;
    finalData.datasets[0].data = macd;
    finalData.datasets[1].data = signal;
    return finalData;
  };
  