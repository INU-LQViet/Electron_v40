function plot_chart(socket){
    var ctx1 = document.getElementById('chart').getContext('2d');
    var startChart = document.getElementById('startChart');
    var resetChart = document.getElementById('resetChart');
    var exportData = document.getElementById('exportData');
    var startpoint;
    // var start;
    const step = 0.02;
    

    function createChart(){
        var chart = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: "Arduino Signal",
                    borderColor: "#FF5733",
                    data: [],
                    fill: false,
                    pointStyle: 'circle',
                    backgroundColor: '#3498DB',
                    pointRadius: 0.1,
                    pointHoverRadius: 0.1,
                    lineTension: 0,
                }]
            },
            options:{
                animation: false,
                scales:{
                    x:{
                        type: 'time', 
                        beginAtZero: true,
                        title:{
                            display: true,
                            text: 'Voltage (V)'
                        },
                        time:{
                            unit: 'millisecond',
                            stepSize: 1,
                        }
                    },
                    y:{
                        type:'linear',
                        min:0,
                        max:3,
                        title:{
                            display: true,
                            text: 'Time (ms)'
                        },
                        ticks:{
                            callback: function(value){
                                return Math.round(1000*value)/1000
                            }
                        }
                    }
                }
            }
        });
        return chart
    };

    function dowloadFile(filePath){
        var link=document.createElement('a');
        link.href = filePath;
        link.download = filePath.substr(filePath.lastIndexOf('/') + 1);
        link.click();
    };
    
    startChart.addEventListener('click',()=>{
        startpoint = 0;
        // start = Date.now();
        chart = createChart();
        socket.on('signal',(data)=>{
            // console.log(data.signal);
            if(chart.data.labels.length !=1000){
                chart.data.labels.push(startpoint);
                chart.data.datasets.forEach((dataset)=>{
                    dataset.data.push(data.signal);
                });
            }else{
                chart.data.labels.shift();
                chart.data.labels.push(startpoint);
                chart.data.datasets.forEach((dataset)=>{
                    dataset.data.shift();
                    dataset.data.push(data.signal);
                });
            };
            startpoint += step;
            chart.update();
        });
    });

    exportData.addEventListener('click',()=>{
        dowloadFile('/example.csv');
    });

    resetChart.addEventListener('click',()=>{
        // console.log('chart is clear!');
        chart.destroy();
    });
}
