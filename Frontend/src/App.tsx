import { useEffect, useRef, useState } from 'react'

import Chart from 'chart.js/auto'

import './App.css'





function App() {
  const baseUrl = "http://127.0.0.1:8000/nuclear-outages"

  const chartRef = useRef<HTMLCanvasElement | null>(null);


  const [capacity, setCapacity] = useState(false);
  const [outage, setOutage] = useState(false);
  const [percentOutage, setPercentOutage] = useState(false);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");


  const [apiData, setApiData] = useState<any>(null);



  const toggleCheckbox = (value: boolean, setter: React.Dispatch<React.SetStateAction<boolean>>) => {
      const checkedCount = Number(capacity) + Number(outage) + Number(percentOutage);

      
      if (value && checkedCount === 1) {
          return;
      }

      setter(!value);
  };



  useEffect(() => {
    const url = new URL(baseUrl);

    url.searchParams.set("frequency", "daily");

    if (capacity) url.searchParams.set("capacity", String(capacity));
    if (outage) url.searchParams.set("outage", String(outage));
    if (percentOutage) url.searchParams.set("percentOutage", String(percentOutage));

    if (dateFrom) url.searchParams.set("dateFrom", dateFrom);
    if (dateTo) url.searchParams.set("dateTo", dateTo);


    const getInfo = async () => {
      const response = await fetch(url);
      const result = await response.json()

      setApiData(result);
    }

    getInfo();
  }, [capacity, outage, percentOutage, dateFrom, dateTo])


  
  function groupData(data: any[]) {
    if (!data.length) return [];

    const mode = data.length > 365 ? "year" : data.length > 31 ? "month" : "day";

    const grouped = new Map();

    for (const row of data) {
      const date = new Date(row.period);
      let key: string;

      switch (mode) {
        case "year":
          key = date.getFullYear().toString();
          break;

        case "month":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          break;

        default:
          key = row.period;
      }

      if (!grouped.has(key)) {
        grouped.set(key, {
          label: key,
          count: 0,

          capacity: 0,
          outage: 0,
          percentOutage: 0,
        });
      }

      const item = grouped.get(key);

      item.count++;

      item.capacity += Number(row.capacity);
      item.outage += Number(row.outage);
      item.percentOutage += Number(row.percentOutage);
    }
    

    for (const item of grouped.values()) {
      item.percentOutage /= item.count;
    }

    return [...grouped.values()];
  }


  const grouped = apiData ? groupData(apiData.data).toReversed() : [];

  const labels = grouped.map(x => x.label);

  const capacityInfo = grouped.map(x => x.capacity);
  const outageInfo = grouped.map(x => x.outage);
  const percentOutageInfo = grouped.map(x => x.percentOutage);

  

  useEffect(() => {
    if (!chartRef.current) return;


    const chart = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Capacity',
            data: capacityInfo
          },
          {
            label: 'Outage (MW)',
            data: outageInfo,
          },
          {
            label: '% Outage',
            data: percentOutageInfo
          }
        ]
      }
    });

    return () => {
      chart.destroy();
    }
  }, [apiData]);


  return (
    <div id='content'>
      <div id='title'>Nuclear Outages in the US</div>


      <div id='input'>
        <div style={{fontSize: '30px'}}>Input Info</div>

        <div id='input-data-checkboxes'>
          <label>
            <input id='capacity-checkbox' type='checkbox' checked={capacity} onChange={() => {toggleCheckbox(capacity, setCapacity)}} />
            <div>Capacity</div>
          </label>
          
          <label>
            <input id='outage-checkbox' type='checkbox' checked={outage} onChange={() => {toggleCheckbox(outage, setOutage)}} />
            <div>Outage</div>
          </label>

          <label>
            <input id='percent-outage-checkbox' type='checkbox' checked={percentOutage} onChange={() => {toggleCheckbox(percentOutage, setPercentOutage)}} />
            <div>% Outage</div>
          </label>


          <label>
            <div>From:</div>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
            <div>{dateFrom}</div>
          </label>

          <label>
            <div>To:</div>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            <div>{dateTo}</div>
          </label>
        </div>
      </div>


      <div id="chart-container">
        <canvas id='nuclear-outages-chart' ref={chartRef}></canvas>
      </div>



      <div id='table'>
        {apiData && (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                {capacity && <th>Capacity</th>}
                {outage && <th>Outage</th>}
                {percentOutage && <th>% Outage</th>}
              </tr>
            </thead>

            <tbody>
              {apiData.data.map((row: any)=>(
              <tr key={row.period}>
                <td>{row.period}</td>
                {capacity && <td>{row.capacity}</td>}
                {outage && <td>{row.outage}</td>}
                {percentOutage && <td>{row.percentOutage}</td>}
              </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default App
