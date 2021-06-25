// const { render } = require("node-sass");

// get svg dimensions using D3's attr function
const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

// using D3's csv function with promise syntax

// d3.csv('https://gist.githubusercontent.com/dtlai/e6e5d2eb28bfd3a59b7af5ba5d534190/raw/7783272c55759f05e7bee19bb014144a607f84ae/monthly_IBM.csv')
d3.csv('./monthly_IBM.csv')
    .then(data => {
        data.forEach(d => {
            d.close = +d.close,
            d.date = new Date(d.date)
        })
        render(data)
    })

// render function that takes in data
// info includes title, axis labels, chart dimension
// xValue, yValue helper methods to represent coords


const render = data => {
    const title = 'IBM Price History';

    const xValue = d => d.date;
    const xAxisLabel = 'Date';

    const yValue = d => d.close; 
    const circleRadius = 2;
    const yAxisLabel = 'Price';

    const margin = { top: 60, right: 40, bottom: 88, left: 250 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    // extent function to find breadth of x & y data
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
    
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
    
    // using append to easily translate multiple items together
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
    
    const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(15);
    const yAxis = d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickPadding(10);
    const yAxisG = g.append('g').call(yAxis);

    yAxisG.selectAll('.domain').remove();
    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -100)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);
    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`);

    xAxisG.select('.domain').remove();
    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 80)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabel);
    g.append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .text(title);

    const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
    g.append('path')
        .attr('class', 'line-path')
        .attr('d', lineGenerator(data));

    g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cy", (d) => yScale(yValue(d)))
      .attr("cx", (d) => xScale(xValue(d)))
      .attr("r", circleRadius);

    const div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    g.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cy", (d) => yScale(yValue(d)))
    .attr("cx", (d) => xScale(xValue(d)))
    .attr("r", circleRadius)
    .on("mouseover", (d) => {
        div.transition().duration(200).style("opacity", 0.9);
        div
        .html(
            d.date.toLocaleString("en-US") +
            "<br/><br/> Open: $" +
            d.open +
            "<br/><br/> Close: $" +
            d.close //+
            // "<br/><br/> Volume(USD): $" +
            // d.volume
        )
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
        div.transition().duration(500).style("opacity", 0);
    });

    
    
}