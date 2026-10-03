import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);


interface BarChartInterface{
    labels:string[];
    datasets:{
        label?:string;
        data:number[];
        backgroundColor:string;
    }[];
    options:ChartOptions<"bar">;   


    //options?:<CoreChartOptions<"bar"> &
    //    ElementChartOptions<"bar"> &
    //    PluginChartOptions<"bar"> &
    //    DatasetChartOptions<"bar"> &
    //    ScaleChartOptions<"bar"> &
    //    BarControllerChartOptions>;   
};

function BarChart({labels, datasets, options}:BarChartInterface) {
    
    return(
        <Bar
            options={options}
            data={{
                labels,
                datasets:[...datasets]
            }}
        />
    )
};

export default BarChart;