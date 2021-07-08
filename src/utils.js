import moment from "moment";

export const formatData = (data) => {
    let finalData = {
      labels: [],
      datasets: [
        {
          label: "Col1",
          data: [],
          backgroundColor: "rgb(10, 10, 10)",
          borderColor: "rgba(200, 200, 200)",
          fill: false
        },
        {
          label: "Col2",
          data: [],
          backgroundColor: "rgb(10, 10, 10)",
          borderColor: "rgba(200, 200, 200)",
          fill: false
        },
        {
          label: "Col3",
          data: [],
          backgroundColor: "rgb(10, 10, 10)",
          borderColor: "rgba(200, 200, 200)",
          fill: false
        },
        {
          label: "Col4",
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
  
    let col1 = data.map((val) => {
      return val[1];
    });
    let col2 = data.map((val) => {
      return val[2];
    });
    let col3 = data.map((val) => {
      return val[3];
    });
    let col4 = data.map((val) => {
      return val[4];
    });
    col1.reverse();
    col2.reverse();
    col3.reverse();
    col4.reverse();
    dates.reverse();
    finalData.labels = dates;
    finalData.datasets[0].data = col1;
    finalData.datasets[1].data = col2;
    finalData.datasets[2].data = col3;
    finalData.datasets[3].data = col4;
    return finalData;
  };

  export const subtractHours = ((strdate,hours)=>{
    var time = moment.duration(hours+":00:00");
    strdate=moment(strdate).subtract(time);
    return strdate.format("YYYY-MM-DDTHH:mm:ss.sssZ");;
  });