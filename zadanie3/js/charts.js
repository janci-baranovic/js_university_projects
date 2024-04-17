document.addEventListener("DOMContentLoaded", () => {
    loadXMLDoc('z03.xml');

    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

    $navbarBurgers.forEach( el => {
        el.addEventListener('click', () => {

            const target = el.dataset.target;
            const $target = document.getElementById(target);

            el.classList.toggle('is-active');
            $target.classList.toggle('is-active');

        });
    });
});

let barChart;

function loadXMLDoc(path) {
    const xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange  = function() {
        if (this.readyState == 4 && this.status == 200) {
            myFunction(this);
        }
    };

    xmlhttp.open('GET', path, true);
    xmlhttp.send();
}

function dynamicChart(xml) {
    const xmlDoc = xml.responseXML;
    console.log(xmlDoc);
    console.log('caues');
}

function myFunction(xml) {
    const xmlDoc = xml.responseXML;

    const record = xmlDoc.getElementsByTagName('zaznam');
    let years = [];
    let grades = [];
    let gradesObj = {
        A: [],
        B: [],
        C: [],
        D: [],
        E: [],
        FX: [],
        FN: []
    };

    for(let i = 0; i < record.length; i++) {
        years.push(record[i].getElementsByTagName('rok')[0].childNodes[0].nodeValue);
        grades = record[i].getElementsByTagName('hodnotenie');
        for( let j = 0; j < grades.length; j++) {
            gradesObj.A.push(grades[j].getElementsByTagName('A')[0].childNodes[0].nodeValue);
            gradesObj.B.push(grades[j].getElementsByTagName('B')[0].childNodes[0].nodeValue);
            gradesObj.C.push(grades[j].getElementsByTagName('C')[0].childNodes[0].nodeValue);
            gradesObj.D.push(grades[j].getElementsByTagName('D')[0].childNodes[0].nodeValue);
            gradesObj.E.push(grades[j].getElementsByTagName('E')[0].childNodes[0].nodeValue);
            gradesObj.FX.push(grades[j].getElementsByTagName('FX')[0].childNodes[0].nodeValue);
            gradesObj.FN.push(grades[j].getElementsByTagName('FN')[0].childNodes[0].nodeValue);
        }
    }

    drawMyBarChart(years, gradesObj);
    drawMyLineChart(years, gradesObj);
    drawMyPieCharts(years, gradesObj);
}

function drawMyBarChart(years, grades) {
    let options = {
        series: [{
            name: 'A',
            data: grades.A
        }, {
            name: 'B',
            data: grades.B
        }, {
            name: 'C',
            data: grades.C
        }, {
            name: 'D',
            data: grades.D
        }, {
            name: 'E',
            data: grades.E
        }, {
            name: 'FX',
            data: grades.FX
        }, {
            name: 'FN',
            data: grades.FN
        }],
        chart: {
            type: 'bar',
            height: 350
        },
        plotOptions: {
            bar: {
            horizontal: false,
            columnWidth: '75%',
            endingShape: 'rounded'
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 1,
            colors: ['transparent']
        },
        xaxis: {
            categories: years,
        },
        yaxis: {
            title: {
            text: 'počet známok'
            }
        },
        colors: ['#23d160', '#209cee', '#ffdd57', '#00d1b2', '#3273dc', '#ff3860', '#7a7a7a'],
        fill: {
            opacity: 1
        },
        title: {
            text: 'Súhrn známok za posledných 6 rokov výučby',
            align: 'center',
            style: {
                fontSize:  '16px',
                fontWeight:  'bold',
                color:  '#263238'
            },
        },
        tooltip: {
            y: {}
        }
    };

    barChart = new ApexCharts(document.querySelector("#bar-chart"), options);
    barChart.render();
}

function drawMyPieCharts(years, grades) {
    for(let i = 0; i < years.length; i++) {
        drawMyPieChart(years[i], grades, i)
    }
}

function drawMyPieChart(year, grades, chartNumber) {
    let options = {
        series: [
            parseInt(grades.A[chartNumber], 10), 
            parseInt(grades.B[chartNumber], 10), 
            parseInt(grades.C[chartNumber], 10), 
            parseInt(grades.D[chartNumber], 10),
            parseInt(grades.E[chartNumber], 10),
            parseInt(grades.FX[chartNumber], 10),
            parseInt(grades.FN[chartNumber], 10)
        ],
        chart: {
            height: 350,
            type: 'pie',
        },
        labels: Object.keys(grades),
        title: {
            text: year,
            align: 'center',
            style: {
                fontSize:  '14px',
                fontWeight:  'bold',
                fontFamily:  undefined,
                color:  '#263238'
            },
        },
        colors: ['#23d160', '#209cee', '#ffdd57', '#00d1b2', '#3273dc', '#ff3860', '#7a7a7a'],
        legend: {
            position: 'bottom'
        }
    };

    const chart = new ApexCharts(document.querySelector(`#pie-chart${chartNumber + 1}`), options);
    chart.render();
}

function drawMyLineChart(years, grades) {
    covidGrades = getCovidGrades(grades);
    covidGradesFX = covidGrades[0]; 
    covidGradesFN = covidGrades[1]; 
    preCovidGrades = getPreCovidGrades(grades);
    preCovidGradesFX = preCovidGrades[0]; 
    preCovidGradesFN = preCovidGrades[1];
    
    var options = {
        series: [{
            name: 'FX',
            data: [preCovidGradesFX, covidGradesFX]
            }, {
            name: 'FN',
            data: [preCovidGradesFN, covidGradesFN]
            }],
        chart: {
            type: 'bar',
            height: 350,
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                legend: {
                    position: 'right',
                    offsetX: -10,
                    offsetY: 0
                }
            }
        }],
        plotOptions: {
            bar: {
                horizontal: false,
                borderRadius: 10,
                dataLabels: {
                    total: {
                        enabled: true,
                        style: {
                            fontSize: '13px',
                            fontWeight: 900
                        }
                    }
                }
            },
        },
        xaxis: {
            categories: [years[2] + ' - ' + years[5], years[0] + ' - ' + years[1]],
        },
        legend: {
            position: 'right',
            offsetY: 40
        },
        colors: ['#ff3860', '#7a7a7a'],
        title: {
            text: 'Počet neúspešných študentov - prezenčná vs. online výučba',
            align: 'center',
            style: {
                fontSize:  '16px',
                fontWeight:  'bold',
                color:  '#263238'
            },
        },
        fill: {
            opacity: 1
        }
    };

    let chart = new ApexCharts(document.querySelector("#line-chart"), options);
    chart.render();
}

function getTotalOfGrades(grades) {
    total = 0;
    return sumGrades = grades.reduce(
        (previousValue, currentValue) => previousValue + parseInt(currentValue),
        total
    );
}

function getCovidGrades(grades) {
    covidFX = grades.FX.slice(0, 2);
    covidFN = grades.FN.slice(0, 2);

    return [getTotalOfGrades(covidFX), getTotalOfGrades(covidFN)];
}

function getPreCovidGrades(grades) {
    preCovidFX = grades.FX.slice(2);
    preCovidFN =  grades.FN.slice(2);

    return [getTotalOfGrades(preCovidFX), getTotalOfGrades(preCovidFN)];
}


function setHorizontal() {
    barChart.updateOptions({
        chart: {
            height: 500
        },
        plotOptions: {
            bar: {
                horizontal: true,
            },
        },
    });
}

function setVertical() {
    barChart.updateOptions({
        chart: {
            height: 350
        },
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
    });
}


//Media Queries

const smallDevice = window.matchMedia("(max-width: 576px)");

smallDevice.addListener(handleDeviceChange);

function handleDeviceChange(event) {
  if (event.matches){
    setHorizontal();
  } else {
    setVertical();
  }
}

handleDeviceChange(smallDevice);