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
    }
  }, [])


  const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

  useEffect(() => {
    if (!chartRef.current) return;


    const chart = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: data.map(row => row.year),
        datasets: [
          {
            label: 'Acquisitions by year',
            data: data.map(row => row.count),
          },
          {
            label: 'Some text',
            data: [20, 10, 35, 8],
          }
        ]
      }
    });

    return () => {
      chart.destroy();
    }
  }, []);


  return (
    <div id='content'>
      <div id='title'>Nuclear Outages in the US</div>


      <div id='input'>
        <div style={{fontSize: '30px'}}>Input Info</div>

        <div id='input-data-checkboxes'>
          <label>
            <input id='capacity-checkbox' type='checkbox' onChange={() => {setCapacity(!capacity)}} />
            <div>Capacity</div>
          </label>
          
          <label>
            <input id='outage-checkbox' type='checkbox' onChange={() => {setOutage(!outage)}} />
            <div>Outage</div>
          </label>

          <label>
            <input id='percent-outage-checkbox' type='checkbox' onChange={() => {setPercentOutage(!percentOutage)}} />
            <div>Percent Outage</div>
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
    </div>
  )
}

export default App
