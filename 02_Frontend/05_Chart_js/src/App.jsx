import Home from './pages/home';

import Line from './charts/Linechart';
import Bar from './charts/barchart';
import Pie from './charts/piechart';
import Doughnut from './charts/doughnutchart'
import Radar from './charts/radarchart';
import Polar from './charts/polarchart';
import Bubble from './charts/bubblechart';
import Scatter from './charts/scatterchart';

import Mixed from './advcharts/mixedchart'
import Stackedbar from './advcharts/stackedbar'
import HorizontalBar from './advcharts/horizontalbar'
import MultiAxis from './advcharts/multiaxis'
import TimeSeries from './advcharts/timeseries'
import Heatmap from './advcharts/heatmap'
import CandleStick from './advcharts/candlestick'


import { useState } from 'react';

const App = () => {
  const [chartname, setChartname] = useState('HeatMap');
  const [chartlist, setchartlist] = useState(true)

  const changeChart = (namec) => {
    // alert(namec)
    setChartname(namec)
  }
  return (
    <div className="h-screen w-full overflow-hidden p-2">

      <div className='h-full w-full p-2  bg-gray-200 ring-2 ring-gray-500 rounded-lg flex flex-row grow gap-2'>

        <div className='h-full w-60 p-2  ring-2 ring-gray-500 rounded-lg'>

          <h1 className='flex justify-center text-3xl font-sans font-bold '> Charts</h1>
          <h1></h1>

          <div>
            <div className='flex flex-col gap-2 justify-start items-center text-lg font-bold p-2 mt-2 outline-2'>
              <button className='w-fit ring-1 hover:underline-offset-8 hover:underlin hover:bg-orange-300 px-3 hover:ring-orange-500 hover:ring rounded-lg' onClick={() => { changeChart('Line') }}>Line</button>
              <button className='w-fit ring-1 hover:underline-offset-8 hover:underlin hover:bg-orange-300 px-3 hover:ring-orange-500 hover:ring rounded-lg' onClick={() => { changeChart('Bar') }}>Bar</button>
              <button className='w-fit ring-1 hover:underline-offset-8 hover:underlin hover:bg-orange-300 px-3 hover:ring-orange-500 hover:ring rounded-lg' onClick={() => { changeChart('Pie') }}>Pie</button>
              <button className='w-fit ring-1 hover:underline-offset-8 hover:underlin hover:bg-orange-300 px-3 hover:ring-orange-500 hover:ring rounded-lg' onClick={() => { changeChart('Doughnut') }}>Doughnut</button>
              <button className='w-fit ring-1 hover:underline-offset-8 hover:underlin hover:bg-orange-300 px-3 hover:ring-orange-500 hover:ring rounded-lg' onClick={() => { changeChart('Radar') }}>Radar</button>
              <button className='w-fit ring-1 hover:underline-offset-8 hover:underlin hover:bg-orange-300 px-3 hover:ring-orange-500 hover:ring rounded-lg' onClick={() => { changeChart('Polar Area') }}>Polar Area</button>
              <button className='w-fit ring-1 hover:underline-offset-8 hover:underlin hover:bg-orange-300 px-3 hover:ring-orange-500 hover:ring rounded-lg' onClick={() => { changeChart('Bubble') }}>Bubble</button>
              <button className='w-fit ring-1 hover:underline-offset-8 hover:underlin hover:bg-orange-300 px-3 hover:ring-orange-500 hover:ring rounded-lg' onClick={() => { changeChart('Scatter') }}>Scatter</button>
            </div>

            <div className='flex flex-col gap-2 justify-start items-center text-lg font-bold p-2 mt-2 outline-2'>
              <button className='w-fit ring-1 hover:underline-offset-8 hover:underlin hover:bg-orange-300 px-3 hover:ring-orange-500 hover:ring rounded-lg' onClick={() => { changeChart('Mixed') }}>Mixed</button>
              <button className='w-fit ring-1 hover:underline-offset-8 hover:underlin hover:bg-orange-300 px-3 hover:ring-orange-500 hover:ring rounded-lg' onClick={() => { changeChart('Stacked Bar') }}>Stacked Bar</button>
              <button className='w-fit ring-1 hover:underline-offset-8 hover:underlin hover:bg-orange-300 px-3 hover:ring-orange-500 hover:ring rounded-lg' onClick={() => { changeChart('Horizontal Bar') }}>Horizontal Bar</button>
              <button className='w-fit ring-1 hover:underline-offset-8 hover:underlin hover:bg-orange-300 px-3 hover:ring-orange-500 hover:ring rounded-lg' onClick={() => { changeChart('Multi Axis') }}>Multi Axis</button>
              <button className='w-fit ring-1 hover:underline-offset-8 hover:underlin hover:bg-orange-300 px-3 hover:ring-orange-500 hover:ring rounded-lg' onClick={() => { changeChart('Time Series') }}>Time Series</button>
              <button className='w-fit ring-1 hover:underline-offset-8 hover:underlin hover:bg-orange-300 px-3 hover:ring-orange-500 hover:ring rounded-lg' onClick={() => { changeChart('HeatMap') }}>HeatMap</button>
              <button className='w-fit ring-1 hover:underline-offset-8 hover:underlin hover:bg-orange-300 px-3 hover:ring-orange-500 hover:ring rounded-lg' onClick={() => { changeChart('CandleStick') }}>CandleStick</button>
            </div>
          </div>

        </div>
        <div className='h-full w-full ring-2 ring-gray-500 rounded-lg p-2'>
          <h1 className='flex justify-center text-5xl font-bold m02 p-2 underline text-orange-500'>{chartname} Chart</h1>

          {(() => {
            switch (chartname) {
              case 'Line':
                return <Line />
              case 'Bar':
                return <Bar />
              case 'Pie':
                return <Pie />
              case 'Doughnut':
                return <Doughnut />
              case 'Radar':
                return <Radar />
              case 'Polar Area':
                return <Polar />
              case 'Bubble':
                return <Bubble />
              case 'Scatter':
                return <Scatter />

              case 'Mixed':
                return <Mixed />
              case 'Stacked Bar':
                return <Stackedbar />
              case 'Horizontal Bar':
                return <HorizontalBar />
              case 'Multi Axis':
                return <MultiAxis />
              case 'Time Series':
                return <TimeSeries />
              // case 'HeatMap':
              //   return <Heatmap />
              case 'CandleStick':
                return <CandleStick />

              default:
                return <Home />
            }
          })()}
        </div>
      </div>
    </div>
  )
}

export default App
