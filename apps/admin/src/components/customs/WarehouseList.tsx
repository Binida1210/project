import axios from 'axios';
import { useEffect, useState } from 'react';
import {
  BooleanField,
  Button,
  Confirm,
  Datagrid,
  FunctionField,
  ListContextProvider,
  TextField,
  useList,
  useNotify,
  useRedirect,
} from 'react-admin';
import styled from 'styled-components';

import { apiUrl, dataProvider } from '../../provider';

type WarehouseRecord = {
  id: number;
  name: string;
  address: string;
  price: number;
  floors: number;
  doors: number;
  area: number;
  rented: boolean;
  [key: string]: unknown;
};

type RawWarehouseRecord = WarehouseRecord & { address: string };

export const WarehouseList = () => {
  const [data, setData] = useState<WarehouseRecord[]>([]);
  const [recordPendingDelete, setRecordPendingDelete] = useState<WarehouseRecord | null>(null);
  const notify = useNotify();
  const redirect = useRedirect();
  const listContext = useList<WarehouseRecord>({ data, resource: 'Warehouse' });

  useEffect(() => {
    const formatAddress = (raw: unknown): string => {
      if (typeof raw !== 'string') return '';
      // Try to parse JSON string { address, position?, ward? }. Fallback to raw if not JSON
      try {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && 'address' in parsed) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (parsed as any).address ?? raw;
        }
      } catch {
        // not JSON -> leave as-is
      }
      return raw;
    };

    axios
      .post<RawWarehouseRecord[]>(`${apiUrl}/warehouse/static`, {
        includes: ['RentedWarehouses', 'Comments', 'Comments.User', 'Images'],
      })
      .then(({ data: response }) => {
        const warehouses: WarehouseRecord[] = (response || []).map((it) => ({
          ...it,
          address: formatAddress(it.address),
        }));
        setData(warehouses);
      });
  }, []);

  const handleConfirmDelete = async () => {
    if (!recordPendingDelete) {
      return;
    }

    try {
      await dataProvider.delete('Warehouse', { id: recordPendingDelete.id });
      setData((prev) => prev.filter((item) => item.id !== recordPendingDelete.id));
      notify('Delete successful', { type: 'info' });
    } catch (error) {
      notify('Delete failed', { type: 'warning' });
    } finally {
      setRecordPendingDelete(null);
    }
  };

  return (
    <PageSection>
      <SectionHeader>
        <h1>All Warehouses</h1>
      </SectionHeader>
      <Confirm
        content={`Are you sure you want to delete warehouse ${recordPendingDelete?.name ?? ''}?`}
        isOpen={Boolean(recordPendingDelete)}
        title="Confirm"
        onClose={() => setRecordPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
      <TableContainer>
        <ListContextProvider value={listContext}>
          <Datagrid bulkActionButtons={false} rowClick={false}>
            <TextField source="id" />
            <TextField label="Name" source="name" />
            <TextField label="Address" source="address" />
            <TextField label="Price" source="price" />
            <TextField label="Floors" source="floors" />
            <TextField label="Doors" source="doors" />
            <TextField label="Area" source="area" />
            <BooleanField label="Rented" source="rented" />
            <FunctionField
              label="Actions"
              render={(record: WarehouseRecord) => (
                <ActionRow>
                  <Button
                    label="View"
                    onClick={(event) => {
                      event.stopPropagation();
                      redirect(`/warehouse/${record.id}`);
                    }}
                  />
                  <Button
                    color="error"
                    label="Delete"
                    onClick={(event) => {
                      event.stopPropagation();
                      setRecordPendingDelete(record);
                    }}
                  />
                </ActionRow>
              )}
            />
          </Datagrid>
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
      width: 280px; /* Địa chỉ - rộng hơn */
      word-wrap: break-word;
      overflow-wrap: break-word;
      white-space: normal;
      line-height: 1.4;
    }
    &:nth-child(4) {
      width: 110px; /* Giá */
    }
    &:nth-child(5),
    &:nth-child(6) {
      width: 70px; /* Tầng và cửa*/
      text-align: center;
    }
    &:nth-child(7),
    &:nth-child(8) {
      width: 100px; /* Diện tích và Đã thuê */
      text-align: center;
    }
    &:nth-child(9) {
      width: 180px; /* Hành động */
      text-align: center;
    }
  }
`;

const ActionRow = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
`;
