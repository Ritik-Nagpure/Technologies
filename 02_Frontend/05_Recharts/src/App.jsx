import { useState } from 'react'
import Home from './pages/Home'
import Line from './charts/Line'

const App = () => {
  const [chartname, changeChart] = useState('Line')

  return (
    <div className='h-screen w-full p-2'>
      <div className='h-full flex flex-row gap-2 ring-2 rounded-xl p-2 bg-gray-200'>

        <div className='h-full w-60  flex flex-col items-center gap-4 ring-1 rounded-xl p-2'>
          <h1 className='text-5xl text-orange-500 font-bold font-sans '>Recharts</h1>
          <div className='flex flex-col gap-2'>

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

        <div className='h-full w-full flex flex-col items-center ring-1 rounded-xl p-2'>
          <h1 className='text-4xl font-bold font-sans text-emerald-500'>{chartname} Chart</h1>
          <br />
          {(() => {
            switch (chartname) {
              case 'Line':
                return <Line />

              // case 'Bar':
              //   return <Bar />
              // case 'Pie':
              //   return <Pie />
              // case 'Doughnut':
              //   return <Doughnut />
              // case 'Radar':
              //   return <Radar />
              // case 'Polar Area':
              //   return <Polar />
              // case 'Bubble':
              //   return <Bubble />
              // case 'Scatter':
              //   return <Scatter />

              // case 'Mixed':
              //   return <Mixed />
              // case 'Stacked Bar':
              //   return <Stackedbar />
              // case 'Horizontal Bar':
              //   return <HorizontalBar />
              // case 'Multi Axis':
              //   return <MultiAxis />
              // case 'Time Series':
              //   return <TimeSeries />
              // case 'HeatMap':
              //   return <Heatmap />
              // case 'CandleStick':
              //   return <CandleStick />

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