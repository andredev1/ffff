export const formatData = (data) => {
    let finalData = {
      labels: [],
      datasets: [
        {
          label: "Price",
          data: [],
          backgroundColor: "rgb(10, 10, 10)",
          borderColor: "rgba(200, 200, 200)",
          fill: false
        }
      ]
    };
  
    let dates = data.map((val) => {
      const ts = val[0];
      let date = new Date(ts * 1000);

      let hour = date.getHours();
      let minute = date.getMinutes();
      let second = date.getSeconds();
      let milliseconds = date.getMilliseconds();

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
  
      let final = `${hour}:${minute}:${second}:${milliseconds}__${day}-${month}-${year}`;
      return final;
    });
  
    let priceArr = data.map((val) => {
      return val[4];
    });
  
    priceArr.reverse();
    dates.reverse();
    finalData.labels = dates;
    finalData.datasets[0].data = priceArr;

    return finalData;
  };
  