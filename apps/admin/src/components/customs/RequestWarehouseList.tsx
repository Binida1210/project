import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Datagrid, FunctionField, ListContextProvider, TextField, useList, useRedirect } from 'react-admin';
import styled from 'styled-components';

import { apiUrl } from '../../provider';

type PendingWarehouseRecord = {
  id: number;
  name: string;
  address: string;
  price: number;
  area: number;
  floors: number;
  doors: number;
  createdDate: string;
  [key: string]: unknown;
};

type RawPendingWarehouseRecord = {
  id: number;
  name: string;
  address: string;
  price: number;
  area: number;
  floors: number;
  doors: number;
  status: number;
  createdDate: string;
};

import { SimpleList } from 'react-admin';

export const RequestWarehouseList = () => {
  const [data, setData] = useState<PendingWarehouseRecord[]>([]);
  const redirect = useRedirect();
  const listContext = useList<PendingWarehouseRecord>({ data, resource: 'Warehouse' });

  useEffect(() => {
    axios
      .post<RawPendingWarehouseRecord[]>(`${apiUrl}/warehouse/static`, {
        includes: ['RentedWarehouses', 'Comments', 'Comments.User', 'Images'],
      })
      .then(({ data: response }) => {
        const warehouses: PendingWarehouseRecord[] = (response || [])
          .filter((it) => it.status === 0)
          .map((it) => {
            let parsedAddress = it.address;
            try {
              const addressObj = JSON.parse(it.address);
              parsedAddress = addressObj.address || it.address;
            } catch {
              parsedAddress = it.address;
            }

            return {
              id: it.id,
              name: it.name,
              address: parsedAddress,
              price: it.price,
              area: it.area,
              floors: it.floors,
              doors: it.doors,
              createdDate: new Date(it.createdDate).toISOString().split('T').join(' '),
            };
          });
        setData(warehouses);
      });
  }, []);

  return (
    <PageSection>
      <SectionHeader>
        <h1>Pending Warehouses</h1>
      </SectionHeader>
      <TableContainer>
        <ListContextProvider value={listContext}>
          {/* Responsive: show simple list on small screens, table on larger */}
          <SimpleList
            primaryText={(record: any) => record.name}
            secondaryText={(record: any) => record.address}
            tertiaryText={(record: any) => `Created: ${record.createdDate}`}
            onClick={(id) => redirect(`/request/${id}`)}
          />
          <div className="desktop-datagrid" aria-hidden>
            <Datagrid bulkActionButtons={false} rowClick={false}>
              <TextField source="id" />
              <TextField label="Name" source="name" />
              <TextField label="Address" source="address" />
              <TextField label="Price" source="price" />
              <TextField label="Floors" source="floors" />
              <TextField label="Doors" source="doors" />
              <TextField label="Area" source="area" />
              <TextField label="Created" source="createdDate" />
              <FunctionField
                label="Actions"
                render={(record: PendingWarehouseRecord) => (
                  <ActionRow>
                    <Button
                      label="View"
                      onClick={(event) => {
                        event.stopPropagation();
                        redirect(`/request/${record.id}`);
                      }}
                    />
                  </ActionRow>
                )}
              />
            </Datagrid>
          </div>
        </ListContextProvider>
      </TableContainer>
    </PageSection>
  );
};

const PageSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const TableContainer = styled.div`
  position: relative;

  /* Tùy chỉnh độ rộng các cột */
  .RaDatagrid-table {
    table-layout: fixed;
    width: 100%;
  }

  .RaDatagrid-headerCell,
  .RaDatagrid-rowCell {
    &:nth-child(1) {
      width: 70px; /* Id */
      text-align: center;
    }
    &:nth-child(2) {
      width: 140px; /* Tên */
    }
    &:nth-child(3) {
      width: 280px; /* Địa chỉ */
      word-wrap: break-word;
      overflow-wrap: break-word;
      white-space: normal;
      line-height: 1.4;
    }
    &:nth-child(4) {
      width: 110px; /* Giá */
      text-align: left;
    }
    &:nth-child(5),
    &:nth-child(6) {
      width: 70px; /* Tầng và cửa */
      text-align: center;
    }
    &:nth-child(7) {
      width: 100px; /* Diện tích */
      text-align: center;
    }
    &:nth-child(8) {
      width: 160px; /* Ngày tạo */
    }
    &:nth-child(9) {
      width: 140px; /* Hành động */
      text-align: center;
    }
  }

  /* responsive: show simple-list on mobile and datagrid on larger screens */
  @media (min-width: 800px) {
    .ra-simple-list { display: none; }
    .desktop-datagrid { display: block; }
  }

  @media (max-width: 799px) {
    .desktop-datagrid { display: none; }
  }
`;

const ActionRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;
