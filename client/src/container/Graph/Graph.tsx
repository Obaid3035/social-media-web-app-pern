import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
   BarElement,
   CategoryScale,
   Chart as ChartJS,
   Legend,
   LinearScale,
   Title,
   Tooltip,
} from 'chart.js';
import moment from 'moment';
import Loader from '../../component/Loader/Loader';
import { getMonthlyRecord, getWeeklyRecord } from '../../services/api/calorie';
import { Container } from 'react-bootstrap';
import './Graph.scss';
import Select from 'react-select';
import { getHelmet } from "../../utils/helmet";

ChartJS.register(
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
);
ChartJS.defaults.font.size = 14;
ChartJS.defaults.font.weight = "bold"
ChartJS.defaults.font.family = "montserrat"

const Graph = () => {
   const nutrientOptions = [
      {
         label: 'Calorie',
         value: 'calorie',
      },
      {
         label: 'Fat',
         value: 'fat',
      },
      {
         label: 'Carb',
         value: 'carb',
      },
      {
         label: 'Sugar',
         value: 'sugar',
      },
   ];

   const periodOptions = [
      {
         label: 'Weekly',
         value: 'week',
      },
      {
         label: 'Monthly',
         value: 'month',
      },
   ];

   const [isLoading, setIsLoading] = useState(false);
   const [weeklySale, setWeeklySale] = useState<any>(null);
   const [monthlySale, setMonthlySale] = useState<any>(null);
   const [selectedNutrient, setSelectedNutrient] = useState(nutrientOptions[0]);
   const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[0]);
   const options = {
      responsive: true,
      scales: {
         y: {
            title: {
               font: {
                  size: 20
               }
            },
         },
      },
      layout: {
         padding: 80,
      },
      plugins: {
         legend: {
            position: 'top' as const,
            labels: {
               font: {
                  size: 16,
               },
            },
         },
         title: {
            display: true,
            text: `${selectedPeriod.label} Records`,
            font: {
               size: 16,
               weight: 'bold',
            },
         },
      },
   };
   const currentDate = moment();
   useEffect(() => {
      console.log(selectedPeriod.value);
      setIsLoading(true);
      const weeklyDays: string[] = [];
      const weekStart = currentDate.clone().startOf('week');
      for (let i = 0; i <= 6; i++) {
         weeklyDays.push(moment(weekStart).add(i, 'days').format('dddd'));
      }
      getWeeklyRecord(selectedNutrient.value).then((res) => {
         setWeeklySale({
            labels: weeklyDays,
            datasets: [
               {
                  label: `${selectedNutrient.label}`,
                  data: res.data,
                  backgroundColor: 'rgb(32, 150, 243)',
               },
            ],
         });
         setIsLoading(false);
      });
   }, [selectedNutrient || selectedPeriod.value === periodOptions[0].value]);

   useEffect(() => {
      setIsLoading(true);
      const monthlyDays: string[] = [];
      const monthStart = currentDate.clone().startOf('month');
      for (let i = 0; i <= 29; i++) {
         monthlyDays.push(moment(monthStart).add(i, 'days').format('DD'));
      }
      getMonthlyRecord(selectedNutrient.value).then((res) => {
         setMonthlySale({
            labels: monthlyDays,
            datasets: [
               {
                  label: `${selectedNutrient.label}`,
                  data: res.data,
                  backgroundColor: 'rgb(32, 150, 243)',
               },
            ],
         });
         setIsLoading(false);
      });
   }, [selectedNutrient || selectedPeriod.value === periodOptions[1].value]);

   let bar = (
      <div className={'text-center'}>
         <Loader />
      </div>
   );

   if (!isLoading) {
      if (weeklySale && selectedPeriod.value === periodOptions[0].value) {
         bar = (
            <Container className="graph">
               <Bar options={options} data={weeklySale} />
            </Container>
         );
      } else if (
         monthlySale &&
         selectedPeriod.value === periodOptions[1].value
      ) {
         bar = (
            <Container className="graph">
               <Bar options={options} data={monthlySale} />
            </Container>
         );
      }
   }

   return (
      <div className={'bar'}>
         { getHelmet('Graph') }
         <Container>
            <div className={'d-flex justify-content-end my-3'}>
               <Select
                  className={'mx-3'}
                  options={nutrientOptions}
                  isSearchable={false}
                  onChange={(value) => setSelectedNutrient(value!)}
                  value={selectedNutrient}
               />
               <Select
                  options={periodOptions}
                  isSearchable={false}
                  value={selectedPeriod}
                  onChange={(value) => setSelectedPeriod(value!)}
               />
            </div>
         </Container>
         {bar}
      </div>
   );
};

export default Graph;
