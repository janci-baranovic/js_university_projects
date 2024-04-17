let chart;
let amplitude = 1;
let xValues = [];
let sinValues = [];
let cosValues = [];

const source = new EventSource('http://old.iolab.sk/evaluation/sse/sse.php');

source.onmessage = (event) => {
    data = JSON.parse(event.data);
    if (data.x == 0) {
        drawMyLiveChart(data);
    } else {
        sinValues.push(data.y1 * amplitude);
        cosValues.push(data.y2 * amplitude);
        xValues.push(data.x);

        if (sinCheckBox.checked && cosCheckBox.checked) {
            updateChart();
        }

        if (!sinCheckBox.checked) {
            updateChart();
            chart.hideSeries('Sin');
        } 
        
        if (!cosCheckBox.checked) {
            updateChart();
            chart.hideSeries('Cos');
        }

        if (!sinCheckBox.checked && !cosCheckBox.checked) {
            chart.hideSeries('Sin');
            chart.hideSeries('Cos');
        }
                
        updateX();
    }
}

const button = document.querySelector('.button').addEventListener('click', () => {
   source.close();
});

function updateSin() {
    chart.updateSeries(
        [{ data: sinValues }]
    );
}

function updateCos() {
    chart.updateSeries(
            [{ data: cosValues }]
        );
}

function updateChart() {
    chart.updateSeries([
        { 
            data: sinValues
        },
        { 
            data: cosValues 
        }
    ]);
}

function updateX() {
    
    chart.updateOptions({
        xaxis: {
            categories: xValues,
        }
    });
}

function drawMyLiveChart(data) {
    let options = {
        series: [{
            name: "Sin",
            data: [data.y1]
        }, {
            name: "Cos",
            data: [data.y2]
        }],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            },
            zoom: {
                enabled: true,
                type: 'xy',  
                autoScaleYaxis: false,  
                zoomedArea: {
                    fill: {
                        color: '#90CAF9',
                        opacity: 0.4
                    },
                    stroke: {
                        color: '#0D47A1',
                        opacity: 0.4,
                        width: 1
                    }
                }
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        title: {
            text: 'Sin & Cos',
            align: 'center',
            style: {
                fontSize:  '16px',
                fontWeight:  'bold',
                color:  '#263238'
            },
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            categories: [data.x],
        }
    };

    chart = new ApexCharts(document.querySelector("#live-chart"), options);
    chart.render();
}

class MySlider extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        const input = document.createElement('input');
        input.setAttribute('type', 'range');
        input.setAttribute('min', this.getMin());
        input.setAttribute('max', this.getMax());
        input.setAttribute('value', this.getMin());
        input.classList.add('slider');

        const valueContainer = document.createElement('span');
        valueContainer.classList.add('slider-value');
        valueContainer.innerHTML = this.getMin();
        valueContainer.style.left = `calc(${this.getMin()}% + (${16 - (this.getMin() * 0.45)}px))`;


        const styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '../css/style.css');

        this.shadowRoot.appendChild(styleLink);
        this.shadowRoot.appendChild(input);
        this.shadowRoot.appendChild(valueContainer);

        this.inputUpdateFunc = (event) => {
            const customEvent = new CustomEvent('input-update', {
                bubbles: true,
                composed: true,
                detail: {
                    min: this.getMin(),
                    max: this.getMax(),
                    value: event.target.value,
                    container: valueContainer
                },
            });
            this.dispatchEvent(customEvent);
            amplitude = parseInt(event.target.value);
        }

        this.shadowRoot.querySelector(".slider").addEventListener("change", this.inputUpdateFunc);
    }

    getMin() {
        return this.hasAttribute("min") ? this.getAttribute("min") : 1;
    }

    getMax() {
        return this.hasAttribute("max") ? this.getAttribute("max") : 10;
    }

    getValue() {
        return this.getAttribute('value');
    }

    // setValue(value) {
    //     myTextField.setAttribute('value', value);
    //     myTextField.shadowRoot.children[1].value = myTextField.getValue();
    // }

    // connectedCallback(){
    //     this.shadowRoot.addEventListener("change", (event) => {
    //         amplitude = parseInt(event.target.value);
    //         this.setValue(event.target.value);
    //     });
    // }
}

// class MyTextField extends HTMLElement {
//     constructor() {
//         super();

//         this.attachShadow({mode: 'open'});

//         const input = document.createElement('input');
//         input.setAttribute('type', 'number');
//         input.setAttribute('min', this.getMin());
//         input.setAttribute('max', this.getMax());
//         input.setAttribute('value', this.getMin());
//         input.classList.add('input-field');

//         const styleLink = document.createElement('link');
//         styleLink.setAttribute('rel', 'stylesheet');
//         styleLink.setAttribute('href', '../css/style.css');

//         this.shadowRoot.appendChild(styleLink);
//         this.shadowRoot.appendChild(input);
//     }

//     getMin() {
//         return this.hasAttribute("min") ? this.getAttribute("min") : 1;
//     }

//     getMax() {
//         return this.hasAttribute("max") ? this.getAttribute("max") : 10;
//     }

//     getValue() {
//         return this.getAttribute('value');
//     }

//     setValue(value) {
//         mySlider.setAttribute('value', value);
//         mySlider.shadowRoot.children[1].value = mySlider.getValue();
//     }

//     connectedCallback(){
//         this.shadowRoot.addEventListener("change", (event) => {
//             amplitude = parseInt(event.target.value);
//             this.setValue(event.target.value);
//         });
//     }
// }

customElements.define('my-slider', MySlider);
// customElements.define('my-text-field', MyTextField);

document.addEventListener("input-update", (event) => {
    numberInput.value = event.detail.value;
    positionSliderThumb(event.detail.container, event.detail.value, event.detail.min, event.detail.max);
});

function positionSliderThumb(container, value, min, max) {
    const newValue = Number(((value - min) * 100) / (max - min));
    container.innerHTML = value;
    container.style.left = `calc(${newValue}% + (${16 - (newValue * 0.45)}px))`;
}

const mySlider = document.getElementsByTagName('my-slider')[0];
// const myTextField = document.getElementsByTagName('my-text-field')[0];
const numberInput = document.getElementById('number-input');


const sliderRadio = document.getElementById('slider');
const inputRadio = document.getElementById('input-field');

sliderRadio.addEventListener('change', () => {
    if (sliderRadio.checked) {
        mySlider.classList.remove('hidden');
        numberInput.classList.add('hidden');
    }
});

inputRadio.addEventListener('change', () => {
    if (inputRadio.checked) {
        mySlider.classList.add('hidden');
        numberInput.classList.remove('hidden');
    }
});

const sinCheckBox = document.getElementsByName('sin')[0];
const cosCheckBox = document.getElementsByName('cos')[0];

sinCheckBox.addEventListener('change', () => {
    if (sinCheckBox.checked) {
        chart.showSeries('Sin');
    } else {
        chart.hideSeries('Sin');
    }
});

cosCheckBox.addEventListener('change', () => {
    if (cosCheckBox.checked) {
        chart.showSeries('Cos');
    } else {
        chart.hideSeries('Cos');
    }
});

numberInput.addEventListener('change', (event) => {
    amplitude = parseInt(event.target.value);
    mySlider.shadowRoot.children[1].value = event.target.value;
    const container = mySlider.shadowRoot.children[2];
    positionSliderThumb(container, event.target.value, event.target.min, event.target.max)
})