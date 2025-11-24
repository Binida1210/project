import axios from 'axios';
import {
  ActiveElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartData as ChartJsData,
  ChartEvent,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';

import { ChartData } from '../../models/chart-data.model';
import { RentedWarehouseRevenue } from '../../models/rented-warehouse-revenue.model';
import { apiUrl } from '../../provider';
import {
  calculateRevenuePerDayByStatus,
  calculateRevenuePerMonthByStatus,
  generateBarChartOptions,
} from '../../utils/chart-data.util';
import { generateDayLabelsInMonth, generateMonthLabels } from '../../utils/time.util';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CURRENT_YEAR = new Date().getFullYear();

type RentedWarehouseApiRecord = {
  rentedInfo: {
    deposit: number;
    total: number;
    status: number;
    rentedDate: string;
    endDate: string;
  };
};

type BarClickPayload = {
  chart: ChartJS;
  event: ChartEvent;
  elements: ActiveElement[];
};

const toBarChartData = (data: ChartData): ChartJsData<'bar', number[], string> => ({
  labels: data.labels,
  datasets: data.datasets as ChartJsData<'bar', number[], string>['datasets'],
});

export const Revenue = () => {
  const [rentedWarehouseRevenue, setRentedWarehouseRevenue] = useState<RentedWarehouseRevenue[]>([]);
  const [yearChartData, setYearChartData] = useState<ChartData | null>(null);
  const [monthChartData, setMonthChartData] = useState<ChartData | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  const onClickMonthBar = ({ elements }: BarClickPayload) => {
    if (elements.length) {
      setSelectedMonth(elements[0].index + 1);
    }
  };

  useEffect(() => {
    axios
      .post<RentedWarehouseApiRecord[]>(`${apiUrl}/RentedWarehouse/static`, {
        includes: ['Warehouse'],
      })
      .then(({ data }) =>
        (data || []).map((record) => {
          const info = record.rentedInfo;
          const rentedDate = new Date(info.rentedDate);

          return {
            deposit: info.deposit,
            total: info.total,
            status: info.status,
            rentedMonth: rentedDate.getMonth() + 1,
            rentedYear: rentedDate.getFullYear(),
            rentedDay: rentedDate.getDate(),
          } satisfies RentedWarehouseRevenue;
        }),
      )
      .then((transformed) => setRentedWarehouseRevenue(transformed));
  }, []);

  useEffect(() => {
    const monthLabels = generateMonthLabels();
    setYearChartData({
      labels: monthLabels,
      datasets: [
        {
          label: 'Doanh thu',
          data: calculateRevenuePerMonthByStatus(rentedWarehouseRevenue),
          backgroundColor: '#0ea5e9',
          borderColor: '#0284c7',
          borderWidth: 1,
        },
      ],
    });
  }, [rentedWarehouseRevenue]);

  useEffect(() => {
    if (selectedMonth) {
      const dayLabelsInMonth = generateDayLabelsInMonth(selectedMonth, CURRENT_YEAR);
      setMonthChartData({
        labels: dayLabelsInMonth,
        datasets: [
          {
            label: 'Doanh thu trong tháng',
            data: calculateRevenuePerDayByStatus(rentedWarehouseRevenue, selectedMonth, CURRENT_YEAR),
            backgroundColor: '#38bdf8',
            borderColor: '#0ea5e9',
            borderWidth: 1,
          },
        ],
      });

      setTimeout(() => {
        const monthBarChartElement = document.getElementById('month-bar-chart');
        if (monthBarChartElement) {
          monthBarChartElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [selectedMonth, rentedWarehouseRevenue]);

  return (
    <Container>
      <PageHeader>
        <h1>Thống kê doanh thu</h1>
        <Subtitle>Biểu đồ phân tích doanh thu theo năm {CURRENT_YEAR}</Subtitle>
      </PageHeader>

      {yearChartData ? (
        <ChartCard>
          <ChartHeading>Doanh thu theo tháng</ChartHeading>
          <ChartWrapper>
            <Bar
              data={toBarChartData(yearChartData)}
              options={generateBarChartOptions({ onClickCallback: onClickMonthBar })}
            />
          </ChartWrapper>
        </ChartCard>
      ) : null}

      {selectedMonth ? (
        <ChartCard id="month-bar-chart">
          <ChartHeading>
            Tháng {selectedMonth}/{CURRENT_YEAR}
          </ChartHeading>
          {monthChartData ? (
            <ChartWrapper small>
              <Bar data={toBarChartData(monthChartData)} options={generateBarChartOptions()} />
            </ChartWrapper>
          ) : null}
        </ChartCard>
      ) : null}
    </Container>
  );
};

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 6px;

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--admin-text-primary);
  }
`;

const Subtitle = styled.span`
  font-size: 14px;
  color: var(--admin-text-tertiary);
`;

const ChartCard = styled.section`
  padding: clamp(20px, 3vw, 36px);
  border-radius: var(--admin-radius-lg);
  background: var(--admin-surface);
  border: 2px solid rgba(14, 165, 233, 0.2);
  box-shadow: 0 2px 12px rgba(14, 165, 233, 0.12);
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 1200px) {
    padding: 36px 48px;
  }
`;

const ChartHeading = styled.h4`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--admin-primary);
`;

const ChartWrapper = styled.div<{ small?: boolean }>`
  position: relative;
  width: 100%;
  height: ${(p) => (p.small ? '320px' : '420px')};
  margin-bottom: 8px;

  @media (max-width: 900px) {
    height: ${(p) => (p.small ? '240px' : '320px')};
  }

  @media (max-width: 480px) {
    height: ${(p) => (p.small ? '200px' : '260px')};
  }

  canvas {
    /* ensure canvas fills wrapper when maintainAspectRatio is false */
    width: 100% !important;
    height: 100% !important;
  }
`;
