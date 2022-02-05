import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { uniq } from "lodash";
import college from "/college"
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand, extent, line, symbol, csv } from "d3";

function App() {
  // const dataIn1900 = census.filter(census => census.Year === 1900);
  // const dataIn2000 = census.filter(census => census.Year === 2000);
  // college.forEach((data, i) => {
  //   if(data.)
  // })
  const majorCategory = uniq(college.map((data) => data.Major_category))
  console.log(majorCategory)
  var sortedMajorByCat = []
  

  for (var i = 0; i < college.length; i++) {
    var sortedData = {}
    for (var j = 0; j < majorCategory.length; j++){
      if(college[i].Major_category === majorCategory[j]){
        sortedData.major = college[i].Major
        sortedData.womenPercent = college[i].ShareWomen
        sortedData.menPercent = 1 - college[i].ShareWomen
        sortedData.majorCategory = college[i].Major_category
        sortedMajorByCat[majorCategory[j]]= sortedData
      }
      
    }
    
    
  }
  console.log(sortedMajorByCat)
  

  

  // const ages = []
  // dataIn1900.slice(0, 19).forEach((data) => {ages.push(data.Age)})

  // const population1900 = []
  // const male1900 = dataIn1900.map((data) => data.People).slice(0, 19)
  // const female1900 = dataIn1900.map((data) => data.People).slice(19, 38)

  // for (var i = 0; i < Math.max(male1900.length, female1900.length); i++) {
  //   population1900.push((male1900[i] ) + (female1900[i]));
  // }

  // console.log(population1900)

  // const population2000 = []
  // const male2000 = dataIn2000.map((data) => data.People).slice(0, 19)
  // const female2000 = dataIn2000.map((data) => data.People).slice(19, 38)


  // for (var i = 0; i < Math.max(male2000.length, female2000.length); i++) {
  //   population2000.push((male2000[i] ) + (female2000[i]));
  // }

  // console.log(population2000)

  const chartSize = 700;
  const chartSizeWidth = 1200;
  const margin = 30;
  const legendPadding = 200;

  // const scale = sortedMajorByCat.map(num => num*100)
  // const _extent = extent(scale);
  // console.log(_extent)
  const _scaleY = scaleLinear()
    .domain([0, 100])
    .range([chartSize - margin, margin]);
  
  const _scaleMajorCat = scaleBand()
    .domain(majorCategory)
    .range([0, chartSizeWidth]);

  return (
    <div style={{ margin: 50 }}>
      <h1>Which major category has the most unblanced percentage between men and women?</h1>
      <div style={{ display: "flex" }}>
      <svg
          width={chartSizeWidth + legendPadding}
          height={chartSize + 50}
        >
          <AxisLeft strokeWidth={1} left={margin + 50} scale={_scaleY} />
          <AxisBottom
            strokeWidth={1}
            top={chartSize - margin}
            left={margin + 50}
            scale={_scaleMajorCat}
            tickValues={majorCategory}
          />

          <text x="-400" y="30" transform="rotate(-90)" fontSize={16}>
            Percentage
          </text>

          <text x="600" y="720" fontSize={16}>
            Major Categories
          </text>

          

          {sortedMajorByCat.map((data, i) => {
            return (
              <rect
                x={97 + i * 63}
                y={_scaleY(data[i].womenPercent*100)}
                height={_scaleY(0) - _scaleY(data.womenPercent*100)}
                width={15}
                fill={`rgb(${100},${100},${100})`}
              />
              
            );
          })}

          {sortedMajorByCat.map((data, i) => {
            return (
              <rect
                x={112 + i * 63}
                y={_scaleY(data[i].menPercent*100)}
                height={_scaleY(0) - _scaleY(data.menPercent*100)}
                width={15}
                fill={`rgb(${200},${200},${200})`}
              />
            );
          })}

        </svg>
      </div>
      <text>
            Data Description:
            In the year 1900 and 2000 
      </text>
    </div>
  );
}

export default App
