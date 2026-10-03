import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DoughnutChartInterface{
    labels:string[];
    datasets:{
        label?:string;
        data:number[];
        backgroundColor:string[];
        borderColor:string[];
        borderWidth:number;
    }[];
    options:ChartOptions<"doughnut">;
};

function DoughnutChart({labels, datasets, options}:DoughnutChartInterface) {
    
    return(
        <Doughnut
            options={options}
            data={{
                labels,
                datasets:[...datasets]
            }}
        />
    )
};

export default DoughnutChart;