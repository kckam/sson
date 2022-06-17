
const COLORS = ["#9b9b61","#1e7e34","#606981","#4deb19","#ccc","#1952eb"]

const CONTENT = [
    {
        page: 1,
        title: "introduction",
        inner: `
        <article class=" page-1">
            <div>
                <h3>Lorem ipsum dolor sit amet consectetur adipisicing elit</h3>

                <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, nobis magnam repudiandae doloribus molestias eaque est accusamus exercitationem, labore modi voluptates fuga animi. Aliquam quibusdam commodi quasi incidunt aspernatur ratione.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, nobis magnam repudiandae doloribus molestias eaque est accusamus exercitationem, labore modi voluptates fuga animi. Aliquam quibusdam commodi quasi incidunt aspernatur ratione.
                    <br /><br /><br  />
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, nobis magnam repudiandae doloribus molestias eaque est accusamus exercitationem, labore modi voluptates fuga animi. Aliquam quibusdam commodi quasi incidunt aspernatur ratione.
                </p>

                <ul>
                    <li>Lorem ipsum dolor sit amet</li>   
                    <li>Lorem ipsum dolor sit amet</li>   
                    <li>Lorem ipsum dolor sit amet</li>   
                </ul>
                <br />
                <br />
                <i>Published March 2022</i>
            </div>
        </div>
        `
    },
    {
        page: 2,
        title: "bar chart breakdown 2022",
        inner: `
        
        <article class=" page-2">
            <div class="container-fluid">
                <div class="row chart"> 
                    <div class="col-xl-9 chart__item">
                        <h3 class="text-center mt-3">Lorem ipsum dolor sit amet</h3>
                        <div id="chart"></div>
                    </div>
                    <div class="col-xl-3 chart__desc">
                        <ul>
                            <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae, quas ea cumque, alias aperiam dolor</li>
                            <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae, quas ea cumque, alias aperiam dolor</li>
                            <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae, quas ea cumque, alias aperiam dolor</li>
                        </ul>
                    </div>
                </div>
            </div>
        </article>
       
        `
    }
]


function populateContent(e) {
    let {title, inner} = CONTENT.find(el=>el.page === +e.target.getAttribute('data-page'));
    document.querySelector(".content__inner").innerHTML = inner;
    document.querySelector(".content__title").innerHTML = title;
    document.querySelectorAll(".content-nav__item").forEach(el=>el.classList.remove('content-nav__item--active'));
    e.target.classList.add('content-nav__item--active');

    +e.target.getAttribute('data-page') === 2 && initGraph();
}

async function initGraph() {
    let margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = document.getElementById("chart").offsetWidth - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
    let offset = 8;

    let svg = d3.select("#chart")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    const response = await fetch('http://localhost:8000');
    const data = await response.json();

    data.sort(function(a,b) {
        return b[1] - a[1];
      });


    let x = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function([label]) { return label; }))
    .padding(0.2);
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    let y = d3.scaleLinear()
    .domain([0, Math.ceil(Math.max.apply(Math, data.map(([_,val])=>val))/10)*10])
    .range([ height, 0]);
    svg.append("g")
    .call(d3.axisLeft(y));

    svg.selectAll("mybar")
    .data(data)
    .enter()
    .append("rect")
        .attr("x", function([label]) { return x(label); })
        .attr("y", function([_,val]) { return y(val); })
        .attr("width", x.bandwidth())
        .attr("height", function([_,val]) { return height - y(val); })
        .attr("fill", function([_,val],i){ return COLORS[i] ? COLORS[i]: "#"+Math.floor(Math.random()*16777215).toString(16)})
    ;

    
    svg
    .selectAll("mytext")
    .data(data)
    .enter()
    .append("text")
    .text(([_,val]) => val+"%")
    .attr("x", function([label]) { return x(label); })
    .attr("dx", x.bandwidth()/2 - offset)
    .attr("y", function([_,val]) { console.log(600-y(val));  return (height+offset+y(val))/2; });
}

window.onload = function(){
    document.querySelectorAll(".content-nav__item").forEach((el)=>{
        el.addEventListener("click", populateContent)
    })
    
    document.querySelector('.content-nav__item[data-page="1"]').click()
// initGraph();

}