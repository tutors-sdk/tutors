import type { Course } from '$lib/services/models/lo-types';

export function piechart(bgPatternImg: HTMLImageElement, course: Course, allUsersTopicActivity: any[], singleUserInnerData: { name: string; value: number; }[], singleUserOuterData: { value: number; name: string; type: string; }[]) {
  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} mins ({d}%)'
    },
    backgroundColor: {
      image: bgPatternImg,
      repeat: 'repeat'
    },
    legend: {
      data: singleUserInnerData.filter(topic => topic.value > 0)|| []
    },
    series: [
      {
        name: 'Inner Pie',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '30%'],
        label: {
          position: 'inner',
          fontSize: 14
        },
        labelLine: {
          show: false
        },
        data: allUsersTopicActivity.length !== 0 ? allUsersTopicActivity.filter(topic => topic.value > 0) : singleUserInnerData.filter(topic => topic.value > 0) || []
      },
      {
        name: 'Outer Pie',
        type: 'pie',
        radius: ['45%', '60%'],
        labelLine: {
          length: 30
        },
        label: {
          formatter: (params: any) => {
            return `{a|${params.data.type}}{abg|}\n{hr|}\n  {b|${params.name}:}{c|${params.value} mins}  {per|${params.percent}%}  `;
          },
          backgroundColor: '#F6F8FC',
          borderColor: '#8C8D8E',
          borderWidth: 1,
          borderRadius: 4,
          rich: {
            a: {
              color: '#6E7079',
              lineHeight: 22,
              align: 'center'
            },
            hr: {
              borderColor: '#8C8D8E',
              width: '100%',
              borderWidth: 1,
              height: 0
            },
            b: {
              color: '#4C5058',
              fontSize: 14,
              fontWeight: 'bold',
              lineHeight: 33
            },
            c: {
              color: '#4C5058',
              fontSize: 14,
              fontWeight: 'normal',
              lineHeight: 33
            },
            per: {
              color: '#fff',
              backgroundColor: '#4C5058',
              padding: [3, 4],
              borderRadius: 4
            }
          }
        },
        data: [''] 
      }
    ]
  };

}