import { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { uniq } from "lodash";
import college from "/college"
import { AxisLeft, AxisBottom } from '@visx/axis';
import { scaleLinear, scaleBand, extent, line, symbol, csv } from "d3";

function App() {

  const majorCategory = uniq(college.map((data) => data.Major_category))
  console.log(majorCategory)
  function filterData(data, category){
    var filteredData = []
    filteredData = data.filter(data => data.Major_category === category);
    filteredData.ShareWomen
    const women = filteredData.map((data) => data.ShareWomen)
    const men = filteredData.map((data) => 1 - data.ShareWomen)
    const arrSortWomen = women.sort();
    const lenWomen = women.length;
    const midWomen = Math.ceil(lenWomen / 2);
    const medianWomen = lenWomen % 2 == 0 ? (arrSortWomen[midWomen] + arrSortWomen[midWomen - 1]) / 2 : arrSortWomen[midWomen - 1];

    const arrSortMen = men.sort();
    const lenMen = men.length;
    const midMen = Math.ceil(lenMen / 2);
    const medianMen = lenMen % 2 == 0 ? (arrSortMen[midMen] + arrSortMen[midMen - 1]) / 2 : arrSortMen[midMen - 1];

    return {women: medianWomen, men: medianMen};

  }
  var genderPercentage = []
  for (var i = 0; i < majorCategory.length; i++){
    let median = filterData(college, majorCategory[i])
    genderPercentage.push(median)

  }
  console.log(genderPercentage)
  

  const chartSizeHeight = 500;
  const chartSizeWidth = 1000;
  const margin = 30;
  const legendPadding = 200;

  const chart2SizeHeight = 1700;
  const chart2SizeWidth = 1000;


  // const scale = sortedMajorByCat.map(num => num*100)
  // const _extent = extent(scale);
  // console.log(_extent)
  const scalePercentage = scaleLinear()
    .domain([0, 100])
    .range([chartSizeHeight - margin, margin]);
  
  const scaleMajorCat = scaleBand()
    .domain(majorCategory)
    .range([0, chartSizeWidth]);

  const earningIn1000 = college.map(data => data.Median/1000)
  const maxEarning = extent(earningIn1000);
  console.log(maxEarning)

  const scaleEarning = scaleLinear()
    .domain([0, maxEarning[1]])
    .range([0, chart2SizeWidth]);

  const unemploymentRate = college.map(data => data.Unemployment_rate * 100);
  const maxUnemploymentRate = extent(unemploymentRate);
  const scaleUnemploymentRate  = scaleLinear()
    .domain([0, maxUnemploymentRate[1]])
    .range([chartSizeHeight, margin]);

  
  const filteredCollegeData = college.filter(data => data.Major_code != 1104);
  const parttimePercentage = filteredCollegeData.map(data => data.Part_time/data.Total *100)
  // const filteredparttimePercentage = parttimePercentage.filter(data => data.Major_code !== "1104");
  const maxParttimePercentage = extent(parttimePercentage);
  console.log(parttimePercentage)
  const scaleParttimePercentage = scaleLinear()
    .domain([0, maxParttimePercentage[1]])
    .range([chartSizeHeight, margin]);

  return (
    <div style={{ margin: 50 }}>
      <h1>College Major Dataset EDA</h1>
      <h2>1. Which major category has the most unblanced percentage between men and women?</h2>
      <div style={{ display: "flex" }}>
      <svg
          width={chartSizeWidth + legendPadding}
          height={chartSizeHeight + 200}
        >
          <AxisLeft strokeWidth={1} left={margin + 50} scale={scalePercentage} />
          <AxisBottom
            strokeWidth={1}
            top={chartSizeHeight - margin}
            left={margin + 50}
            scale={scaleMajorCat}
            tickValues={majorCategory}
            tickLabelProps={(value) => {
              return {
                transform: 'rotate(65 ' + scaleMajorCat(value) + ',0)',
                fontSize: 10,
                dx:30,
                dy:-5,
              }
            }}
          />
          

          <text x="-300" y="30" transform="rotate(-90)" fontSize={16}>
            Percentage (%)
          </text>

          <text x="450" y="680" fontSize={16}>
            Major Categories
          </text>

          

          {genderPercentage.map((data, i) => {
            return (
              <rect
                x={97 + i * 62.5}
                y={scalePercentage(data.women*100)}
                height={scalePercentage(0) - scalePercentage(data.women*100)}
                width={15}
                fill={`rgb(${100},${100},${100})`}
              />
              
            );
          })}

          {genderPercentage.map((data, i) => {
            return (
              <rect
                x={112 + i * 62.5}
                y={scalePercentage(data.men*100)}
                height={scalePercentage(0) - scalePercentage(data.men*100)}
                width={15}
                fill={`rgb(${200},${200},${200})`}
              />
            );
          })}
          <rect
            x={chartSizeWidth }
            y={50}
            height={20}
            width={30}
            fill={`rgb(${200},${200},${200})`}
          />

          <rect
            x={chartSizeWidth}
            y={20}
            height={20}
            width={30}
            fill={`rgb(${100},${100},${100})`}
          />
          

          <text x={chartSizeWidth + 35} y="35" fontSize={12}>
            Women
          </text>

          <text x={chartSizeWidth + 35} y="65" fontSize={12}>
            Men
          </text>

        </svg>

        
      </div>
      <text>
         Chart Description:
      </text>
      <h2>2. What are the majors that might make your college degree pay of the most/the least?</h2>
      <div style={{ display: "flex" }}>
      <svg
          width={chart2SizeWidth + legendPadding}
          height={chart2SizeHeight + 200}
        >
          <AxisBottom
            strokeWidth={1}
            top={chart2SizeHeight + 90}
            left={245}
            scale={scaleEarning}
          />

          {college.map((data, i) => {
            return (
              <line
                key={i}
                x1={245}
                y1={50 + i * 10}
                x2={245 + scaleEarning(data.Median / 1000)}
                y2={50 + i * 10}
                fill="black"
                stroke={"black"}
              />
            );
          })}

          {college.map((data, i) => {
            return (
              <text key={i} x={240} y={52.5 + i * 10} textAnchor="end" fontSize={6}>
                {data.Major}
              </text>
            );
          })}


          <text x="60" y="40" fontSize={12}>
            Major
          </text>
          
          <text x="600" y="1850" fontSize={12}>
            Median Earnings (in $1000)
          </text>
        </svg>
        </div>
        <text>
            Chart Description:
        </text>
        <h2>3. What are the major categories that have the highest and lowest unemployment rate?</h2>
      <div style={{ display: "flex" }}>
        <svg
          width={chartSizeWidth + legendPadding}
          height={chartSizeHeight + 200}
        >
          <AxisLeft strokeWidth={1} left={margin + 50} scale={scalePercentage} />
          <AxisBottom
            strokeWidth={1}
            top={chartSizeHeight - margin}
            left={margin + 50}
            scale={scaleMajorCat}
            tickValues={majorCategory}
            tickLabelProps={(value) => {
              return {
                transform: 'rotate(65 ' + scaleMajorCat(value) + ',0)',
                fontSize: 10,
                dx:30,
                dy:-5,
              }
            }}
          />
          

          <text x="-300" y="30" transform="rotate(-90)" fontSize={16}>
            Unemployment Rate (%)
          </text>

          <text x="450" y="680" fontSize={16}>
            Major Categories
          </text>

          

          {genderPercentage.map((data, i) => {
            return (
              <rect
                x={95 + i * 62.5}
                y={scalePercentage(data.women*100)}
                height={scalePercentage(0) - scalePercentage(data.women*100)}
                width={30}
                fill={`rgb(${100},${100},${100})`}
              />
              
            );
          })}
        </svg>
      </div>
      <text>
        Chart Description:
      </text>
      <h2>4. Does the major that have lower earnings have a higher unemployment rate?</h2>
      <div style={{ display: "flex" }}>
        <svg
          width={chartSizeWidth + legendPadding}
          height={chartSizeHeight + 150}
        >
          <AxisLeft strokeWidth={1} left={100} scale={scaleUnemploymentRate} />
          <AxisBottom
              strokeWidth={1}
              top={chartSizeHeight}
              left={100}
              scale={scaleEarning}
          />
          {college.map((data, i) => {
            return (
              <circle
                key={i}
                cx={scaleEarning(data.Median / 1000)}
                cy={scaleUnemploymentRate(data.Unemployment_rate*100)}
                r={5}
                style={{fill: "rgba(50,50,50,.3)" }}
              />
            );
          })}
          <text x="-300" y="30" transform="rotate(-90)" fontSize={16}>
            Unemployment Rate (%)
          </text>

          <text x="450" y="550" fontSize={16}>
            Median Earnings (in $1000)
          </text>
          
          
        </svg>
        
      </div>
      <text>
        Chart Description:
      </text>

      <h2>5. Does the major that have lower earnings have more part-time job workers?</h2>
      <div style={{ display: "flex" }}>
        <svg
          width={chartSizeWidth + legendPadding}
          height={chartSizeHeight + 150}
        >
          <AxisLeft strokeWidth={1} left={100} scale={scaleParttimePercentage} />
          <AxisBottom
              strokeWidth={1}
              top={chartSizeHeight}
              left={100}
              scale={scaleEarning}
          />
          {filteredCollegeData.map((data, i) => {
            return (
              <circle
                key={i}
                cx={scaleEarning(data.Median / 1000)}
                cy={scaleParttimePercentage(data.Part_time/data.Total *100)}
                r={5}
                style={{fill: "rgba(50,50,50,.3)" }}
              />
            );
          })}
          <text x="-350" y="30" transform="rotate(-90)" fontSize={16}>
            Part-time Job Worker Percentage (%)
          </text>

          <text x="450" y="550" fontSize={16}>
            Median Earnings (in $1000)
          </text>
          
          
        </svg>
        
      </div>
      <text>
        Chart Description:
      </text>
        
    </div>
  );
}


export default App
