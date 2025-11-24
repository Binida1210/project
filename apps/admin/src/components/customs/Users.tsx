import axios from 'axios';
import type { ChartOptions } from 'chart.js';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useEffect, useMemo, useState } from 'react';
import { Button, Datagrid, FunctionField, ListContextProvider, TextField, useList, useRedirect } from 'react-admin';
import { Doughnut } from 'react-chartjs-2';
import styled from 'styled-components';

import { ChartData } from '../../models/chart-data.model';
import { apiUrl } from '../../provider';

ChartJS.register(ArcElement, Tooltip, Legend);

type UserPieData = {
  id: number;
  role: number;
  email: string;
  name: string;
  phone: string;
  ioc: string;
  roleName: string;
};

type RawUserRecord = {
  id: number;
  role: number;
  email: string;
  name: string;
  phoneNumber: string;
  ioc: string;
};

export const Users = () => {
  const [users, setUsers] = useState<UserPieData[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const redirect = useRedirect();
  const listContext = useList<UserPieData>({ data: users, resource: 'User' });

  useEffect(() => {
    axios
      .post<RawUserRecord[]>(`${apiUrl}/user/static`, {})
      .then(({ data }) =>
        (data || []).map((it) => ({
          id: it.id,
          role: it.role,
          email: it.email,
          name: it.name,
          phone: it.phoneNumber,
          ioc: it.ioc,
            roleName: it.role === 2 ? 'Warehouse owner' : 'Renter',
        })),
      )
      .then((v) => setUsers(v));
  }, []);

  const { ownerCount, renterCount } = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        if (user.role === 2) {
          acc.ownerCount += 1;
        } else {
          acc.renterCount += 1;
        }
        return acc;
      },
      { ownerCount: 0, renterCount: 0 },
    );
  }, [users]);

  useEffect(() => {
    setChartData({
        labels: ['Warehouse owners', 'Renters'],
          datasets: [
        {
          label: 'Count',
          data: [ownerCount, renterCount],
          backgroundColor: ['#06b6d4', '#bae6fd'],
          borderColor: ['#0891b2', '#7dd3fc'],
          borderWidth: 2,
        },
      ],
    });
  }, [ownerCount, renterCount]);

  const chartOptions = useMemo<ChartOptions<'doughnut'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem) => {
              const value = tooltipItem.parsed;
                return `${tooltipItem.label}: ${value.toLocaleString('en-US')} users`;
            },
          },
        },
      },
    }),
    [],
  );

  const summaryCards = useMemo(
    () => [
      {
          label: 'Total users',
        value: users.length,
        accent: '#0284c7',
      },
      {
          label: 'Warehouse owners',
        value: ownerCount,
        accent: '#06b6d4',
      },
      {
          label: 'Renters',
        value: renterCount,
        accent: '#bae6fd',
      },
    ],
    [ownerCount, renterCount, users.length],
  );

  return (
    <PageSection>
      <SectionHeader>
          <h1>User statistics</h1>
          <ChartSubtitle>Analysis of users by role</ChartSubtitle>
      </SectionHeader>
      <AnalyticsSection>
        <AnalyticsCard>
          <AnalyticsHeader>
            <ChartTitle>Distribution by role</ChartTitle>
            <ChartSubtitle>Total {users.length.toLocaleString('en-US')} users</ChartSubtitle>
          </AnalyticsHeader>
          <AnalyticsContent>
            <ChartArea>
              <ChartWrapper>{chartData ? <Doughnut data={chartData} options={chartOptions} /> : null}</ChartWrapper>
              <LegendRow>
                <LegendItem $color="#06b6d4">
                  <LegendDot $color="#06b6d4" />
                    <LegendLabel>Warehouse owners</LegendLabel>
                </LegendItem>
                <LegendItem $color="#bae6fd">
                  <LegendDot $color="#bae6fd" />
                    <LegendLabel>Renters</LegendLabel>
                </LegendItem>
              </LegendRow>
            </ChartArea>
            <MetricsColumn>
              {summaryCards.map(({ label, value, accent }) => (
                <MetricItem key={label} $accent={accent}>
                  <MetricValue>{value.toLocaleString('en-US')}</MetricValue>
                  <MetricLabel>{label}</MetricLabel>
                </MetricItem>
              ))}
            </MetricsColumn>
          </AnalyticsContent>
        </AnalyticsCard>
      </AnalyticsSection>
      <Table>
        <ListContextProvider value={listContext}>
          <Datagrid bulkActionButtons={false} rowClick={false}>
            <TextField source="id" />
              <TextField label="Name" source="name" />
            <TextField label="Email" source="email" />
              <TextField label="Phone" source="phone" />
            <TextField label="ID" source="ioc" />
              <TextField label="Role" source="roleName" />
            <FunctionField
              label="Actions"
              render={(record: UserPieData) => (
                <ButtonRow>
                  <Button
                      label="View"
                    onClick={(event) => {
                      event.stopPropagation();
                      redirect(`/users/${record.id}`);
                    }}
                  />
                </ButtonRow>
              )}
            />
          </Datagrid>
        </ListContextProvider>
      </Table>
    </PageSection>
  );
};
const PageSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 28px;
`;

const SectionHeader = styled.header`
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

const Table = styled.div``;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
`;

const AnalyticsSection = styled.div`
  display: flex;
  justify-content: center;
`;

const AnalyticsCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: clamp(20px, 3vw, 36px);
  width: 100%;
  max-width: 1080px;
  border-radius: var(--admin-radius-lg);
  background: var(--admin-surface);
  border: 2px solid rgba(14, 165, 233, 0.2);
  box-shadow: 0 2px 12px rgba(14, 165, 233, 0.12);

  @media (min-width: 1200px) {
    padding: 36px 48px;
  }
`;

const AnalyticsHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ChartTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--admin-primary);
`;

const ChartSubtitle = styled.span`
  font-size: 14px;
  color: var(--admin-text-tertiary);
`;

const AnalyticsContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  align-items: center;

  @media (min-width: 960px) {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    gap: 40px;
  }
`;

const MetricsColumn = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));

  @media (min-width: 960px) {
    max-width: 260px;
    width: 100%;
    grid-template-columns: 1fr;
  }
`;

const ChartArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  width: 100%;
`;

const MetricItem = styled.div<{ $accent: string }>`
  position: relative;
  padding: 18px 20px;
  border-radius: 16px;
  background: linear-gradient(145deg, rgba(241, 245, 249, 0.8), rgba(255, 255, 255, 0.95));
  border: 1px solid rgba(226, 232, 240, 0.7);
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    inset: auto -22% -50% auto;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: ${({ $accent }) => $accent};
    opacity: 0.18;
    filter: blur(1px);
    pointer-events: none;
  }
`;

const MetricValue = styled.h3`
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--admin-text-primary);
`;

const MetricLabel = styled.span`
  font-size: 13px;
  color: var(--admin-text-secondary);
`;

const ChartWrapper = styled.div`
  height: 260px;
  max-width: 540px;
`;

const LegendRow = styled.div`
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
`;

const LegendItem = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--admin-text-primary);
`;

const LegendDot = styled.span<{ $color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: ${({ $color }) => $color};
`;

const LegendLabel = styled.span`
  font-size: 13px;
  color: var(--admin-text-secondary);
`;
