import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { AreaChartInterface } from '../../utils/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);





function AreaChart({labels, data, label="", borderColor, backgroundColor, borderWidth=2, tension=0, fill=false}:AreaChartInterface) {

    return(
        <div className="">
            <Line 
                options={{
                    responsive:true,
                    plugins: {
                        legend: {
                        display: false,
                        },
                        title: {
                        display: false,
                        }
                    },
                    scales:{
                        x:{grid:{display:false}},
                        y:{grid:{display:false}},
                    }
                }} 
                data={{
                    labels,
                    datasets: [{
                        fill,
                        label,
                        data,
                        borderColor,
                        //backgroundColor,
                        borderWidth,
                        hoverBorderWidth:1.5,
                        pointBorderWidth:1,
                        pointHitRadius:10,
                        tension,

                        backgroundColor: (context) => {
                            const { ctx, chartArea } = context.chart;

                            if (!chartArea) {
                                return backgroundColor;
                            }

                            const gradient = ctx.createLinearGradient(
                                0,
                                chartArea.top,
                                0,
                                chartArea.bottom
                            );

                            gradient.addColorStop(0, "oklch(70.4% 0.191 22.216)");
                            gradient.addColorStop(1, "white");

                            return gradient;
                        }
                    }],
                }}
            />
        </div>
    )
};

export default AreaChart;