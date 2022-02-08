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
  const differenceWomen = genderPercentage.map((data) => data.women - data.men)
  const differenceMen = genderPercentage.map((data) => data.men - data.women)
  const top3Women = differenceWomen.slice().sort(function (a, b) { return b - a}).slice(0, 3);
  const top3Men = differenceMen.slice().sort(function (a, b) { return b - a}).slice(0, 3);
  console.log(top3Women)
  console.log(top3Men)

  const chartSizeHeight = 500;
  const chartSizeWidth = 1000;
  const margin = 30;
  const legendPadding = 200;
  const chart2SizeHeight = 1700;
  const chart2SizeWidth = 1000;


  const scalePercentage = scaleLinear()
    .domain([0, 100])
    .range([chartSizeHeight - margin, margin]);
  
  const scaleMajorCat = scaleBand()
    .domain(majorCategory)
    .range([0, chartSizeWidth]);

  const earningIn1000 = college.map(data => data.Median/1000)
  const maxEarning = extent(earningIn1000);
  console.log(maxEarning)

  const arrSortEarning = earningIn1000.sort();
  const lenEarning = earningIn1000.length;
  const midEarning = Math.ceil(lenEarning / 2);
  const medianEarning = earningIn1000.length % 2 == 0 ? (arrSortEarning[midEarning] + arrSortEarning[midEarning - 1]) / 2 : arrSortEarning[midEarning - 1];
  console.log(medianEarning)

  const scaleEarning = scaleLinear()
    .domain([0, maxEarning[1]])
    .range([0, chart2SizeWidth]);

  const unemploymentRate = college.map(data => data.Unemployment_rate * 100);
  const maxUnemploymentRate = extent(unemploymentRate);
  const scaleUnemploymentRate  = scaleLinear()
    .domain([0, maxUnemploymentRate[1]])
    .range([chartSizeHeight, margin]);

  console.log(maxUnemploymentRate)
  
  function filterDataUR(data, category){
    var filteredData = []
    filteredData = data.filter(data => data.Major_category === category);
    filteredData.ShareWomen
    const unemploymentRateData = filteredData.map((data) => data.Unemployment_rate)
    const arrSortUR = unemploymentRateData.sort();
    const lenUR = unemploymentRateData.length;
    const midUR = Math.ceil(lenUR / 2);
    const medianUR = lenUR % 2 == 0 ? (arrSortUR[midUR] + arrSortUR[midUR - 1]) / 2 : arrSortUR[midUR - 1];
    return medianUR;

  }

  var medianUnemploymentRate = []
  for (var i = 0; i < majorCategory.length; i++){
    let median = filterDataUR(college, majorCategory[i])
    medianUnemploymentRate.push(median)

  }

  const scaleURBottom = scaleLinear()
    .domain([0, maxUnemploymentRate[1]])
    .range([0, chart2SizeWidth]);


  const scaleUR = scaleLinear()
    .domain([0, maxUnemploymentRate[1]])
    .range([chartSizeHeight - margin, margin]);


  
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
      <p>
        The College Major dataset contains {college.length} entries, each entry
        represents a different major.
      </p>
      
      <h2>1. Which major category has the most unblanced percentage between men and women?</h2>
      <p>Every major has different gender diversity. There are also gender stereotypes 
        toward different majors. I was wondering what are major categories have the 
        greatest gender disparities and also wondering if the stereotypes are true. 
        Therefore,  here are two charts that show the men’s and women’s percentages 
        in each major category:</p>
      {/* first chart */}
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
                fill={data.women - data.men == top3Women[0]? 'rgb(210, 43, 43)': data.women - data.men == top3Women[1] ? 'rgb(255,64,64)': data.women - data.men == top3Women[2] ? 'rgb(250, 128, 114)':`rgb(${100},${100},${100})`}
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
      <p>
      The first chart highlights the major categories that have more women than men. 
      The three highlighted ones in red are the ones that have the top three greatest differences. 
      The darker color shades mean that the categories have the most differences between women 
      and men when looking at the ones that have more women than men. According to the chart, 
      the top one categories is Psychology and Social Work, the second one is Health, and the 
      third one is Interdisciplinary.
      </p>

      {/* second chart */}
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
                fill={data.men - data.women == top3Men[0]?'rgb(65,105,225)': data.men - data.women == top3Men[1] ? 'rgb(30,144,255)': data.men - data.women == top3Men[2] ? 'rgb(135,206,250)':`rgb(${200},${200},${200})`}
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
      <p>
      The second chart highlights the major categories that have more men than women. 
      Same the first chart, the three highlighted ones are the ones that have the top 
      three greatest differences, but the shades are in blue.  The darker color shades 
      mean that the categories have the most differences between men and women when 
      looking at the ones that have more men than women. According to the chart, the 
      top one categories is Engineering, the second one is Industrial Arts and Consumer 
      Services, and the third one is Computers and Mathematics. I think overall the data 
      does match the stereotypes that more men in the STEM field.
      </p>

      
      <h2>2. What are the majors that might make your college degree pay off the most/the least?</h2>
      <p> As there is a debate between whether colleges should have different tuition based on 
        different majors since the salary they are able to earn after graduating would be 
        different, I was wondering what is the major that potentially would make your college 
        degree pay off the most or the least.</p>
      {/* third chart */}
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
                fill={data.Median / 1000 == maxEarning[1]? 'rgb(220,20,60)': data.Median / 1000 == maxEarning[0]?'rgb(50,205,50)':"black"}
                stroke={data.Median / 1000 == maxEarning[1]? 'rgb(220,20,60)': data.Median / 1000 == maxEarning[0]?'rgb(50,205,50)':"black"}
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
      <p> 
      This chart shows the median salary for each major. The data is sorted 
      from the highest salary to the lowest, but I add highlights to the highest 
      and the lowest ones. The major that has the highest salary and is highlighted
      in red is petroleum engineering which is a little bit surprising to me. 
      Its median salary is $110000. On the other hand, the major that has the 
      lowest salary and is highlighted in green is library science Its median 
      salary is $22000.
      </p>

      {/* forth chart */}
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
                fill={data.Median / 1000 >= medianEarning? 'rgb(255,140,0)':"black"}
                stroke={data.Median / 1000 >= medianEarning? 'rgb(255,140,0)':"black"}
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
        <p> 
        For this chart. The ones that are colored in orange are the ones that are above 
        the median of all salaries. The median of all salaries is ${medianEarning*1000}. 
        Since it is hard to estimate how much money we need to pay off college, I think 
        it is good to compare the salaries with each other. There are 92 majors that have 
        a salary more than the median of all salaries in the dataset.
        </p>
      <h2>3. What are the majors and major categories that have the highest and lowest unemployment rate?</h2>
      <p> 
      When students try to decide which major to study, besides studying our interested field, 
      we can also see its future potential by looking at the data to see if it has a low 
      unemployment rate. With this question, I want to look at not only each major but also 
      with major categories.
      </p>
      {/* fifth chart */}
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

          

          {medianUnemploymentRate.map((data, i) => {
            return (
              <rect
                x={95 + i * 62.5}
                y={scaleUR(data*100)}
                height={scaleUR(0) - scaleUR(data*100)}
                width={30}
                fill={data == Math.max(...medianUnemploymentRate)?'rgb(220,20,60)': data == Math.min(...medianUnemploymentRate)?'rgb(50,205,50)':`rgb(${100},${100},${100})`}
              />
              
            );
          })}
        </svg>
      </div>
      <p> 
      For this chart, to get the unemployment rate for each major category by taking the 
      median of the unemployment rate from all the majors in the categories. The major 
      category that has the highest unemployment rate is social science which is {Math.max(...medianUnemploymentRate)*100}%. 
      The major category that has the lowest unemployment rate is education which is {Math.min(...medianUnemploymentRate)*100}%. 
      In the chart, I highlight hte highest one in read and the lowest one in green.
      </p>

      {/* sixth chart */}
      
      <div style={{ display: "flex" }}>
        <svg
          width={chart2SizeWidth + legendPadding}
          height={chart2SizeHeight + 200}
        >
          <AxisBottom
            strokeWidth={1}
            top={chart2SizeHeight + 90}
            left={245}
            scale={scaleURBottom}
          />

          {college.map((data, i) => {
            return (
              <line
                key={i}
                x1={245}
                y1={50 + i * 10}
                x2={245 + scaleURBottom(data.Unemployment_rate *100)}
                y2={50 + i * 10}
                fill={data.Unemployment_rate *100 == maxUnemploymentRate[1]? 'rgb(220,20,60)': data.Unemployment_rate *100 == maxUnemploymentRate[0]?'rgb(50,205,50)':"black"}
                stroke={data.Unemployment_rate *100 == maxUnemploymentRate[1]? 'rgb(220,20,60)': data.Unemployment_rate *100 == maxUnemploymentRate[0]?'rgb(50,205,50)':"black"}
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
      <p> 
        In this chart, I list out all the major with their unemployment rate. I also 
        highlighted the major with the highest unemployment rate in red. It was surprising 
        to me that the major with the highest unemployment rate is nuclear engineer which 
        is {maxUnemploymentRate[1]}%. The majors with the lowest unemployment rate are mathematics 
        and computer science, military technologies, botany, soil science, educational 
        administration and supervision. They all have 0% unemployment rate which I think I can 
        be true but also can due to the sample size. Comparing this cart with the one with major 
        categories. It was surprising that the major with the highest unemployment rate is not 
        in the major categories that have the highest unemployment rate.
      </p>

      <h2>4. Does the major that have lower earnings have a higher unemployment rate?</h2>
      <p> 
        Since I think the unemployment rate might be related to their earning, 
        I would like to see if the data can show the correlation or prove that 
        their is no relationship. My assumption is that the lower the employment 
        rate, the higher the earnings.
      </p>
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
      <p> 
        I use a scatter plot for this question because I think it can show the relationship 
        more clearly. It turns out that their might not be a correlation between unemployment
         rate and earnings since the dots spread out on the chart.
      </p>

      <h2>5. Does the major that have lower earnings have more part-time job workers?</h2>
      <p> 
      I also have an assumption that the major with lower earnings might also have a 
      larger percentage part-time job workers. Therefore, I would like to see if the 
      data can prove the correlation.
      </p>
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
      <p> 
      To see the correlation between the earnings and the percentage part-time job workers 
      over the total workers of the major, I also use scatter plot for this question. The 
      result shows that the earning and the percentage part-time job workers has a negative 
      correlation. This means that with a larger percentage of part-time job workers, it 
      would have a lower earnings. We can also see that there are some outliers in the data 
      as well.
      </p>
        
    </div>
  );
}


export default App
