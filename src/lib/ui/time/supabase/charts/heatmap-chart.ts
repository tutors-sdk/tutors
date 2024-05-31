export function heatmap(categories: Set<string>, yAxisData: string[], series: HeatMapSeriesData[], bgPatternImg: HTMLImageElement, chartTitleString: string): EChartsOption {
  let visualmapValue: number;
  let gridConfig;


  if (series[0]?.data) {
    if(series[0].name === 'Lab Activity For All Users' || series[0].name === 'Topic Activity For All Users'){
    gridConfig = {
      left: '30%',
      right: '30%',
      bottom: '10%',
      top: '15%',
      width: '40%',  // Fixed width
      height: '400px',  // Fixed height
      containLabel: false  // Prevent resizing based on labels
    };
      
  }else{
    gridConfig = {
      left: '30%',
      right: '30%',
      bottom: '10%',
      top: '15%',
      width: '40%',  // Fixed width
      height: '60px',  // Fixed height
      containLabel: false  // Prevent resizing based on labels
    };
  }
    
    visualmapValue = series[0].data.length !== 0 ? Math.max(...series[0].data.map(item => item[2])) : 0;
  } else if (series?.data) {
    gridConfig = {
      left: '30%',
      right: '30%',
      bottom: '10%',
      top: '15%',
      width: '40%',  // Fixed width
      height: '300px',  // Fixed height
      containLabel: false  // Prevent resizing based on labels
    };
    visualmapValue = series.data.length !== 0 ? Math.max(...series.data.map(item => item[2])) : 0;
  } else {
    visualmapValue = 0;
  }

  return {
    title: {
      top: '5%',
      left: 'center',
      text: chartTitleString,
    },
    tooltip: {
      position: 'top'
    },
    backgroundColor: {
      image: bgPatternImg,
      repeat: 'repeat'
    },
    grid: gridConfig,
    xAxis: {
      type: 'category',
      data: Array.from(categories),
      splitArea: {
        show: true
      },
      axisLabel: {
        rotate: -40,
        interval: 0,
        fontSize: 15,
        margin: 5, // Adjust margin to control spacing
      },
      axisTick: {
        alignWithLabel: true
      },
      axisPointer: {
        type: 'shadow'
      },
      position: 'bottom'
    },
    yAxis: {
      type: 'category',
      data: yAxisData[0] !== undefined ? yAxisData : '',
      splitArea: {
        show: true
      },
      axisLabel: {
        interval: 0,
        fontSize: 15
      },
    },
    visualMap: {
      min: 0,
      max: visualmapValue,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '5%' // Adjusted position to avoid overlap with grid
    },
    series: series
  }
};
