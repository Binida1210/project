import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, useRedirect } from 'react-admin';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { apiUrl } from '../../provider';

type UserDetailRecord = {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  ioc: string;
  role: number;
  roleName: string;
};

type RawUserDetailResponse = Omit<UserDetailRecord, 'roleName'>;

export const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const redirect = useRedirect();
  const [user, setUser] = useState<UserDetailRecord | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    axios.post<RawUserDetailResponse>(`${apiUrl}/user/static/${id}`, {}).then(({ data }) => {
      if (!data) {
        setUser(null);
        return;
      }

      setUser({
        ...data,
        roleName: data.role === 2 ? 'Chủ kho' : 'Người thuê',
      });
    });
  }, [id]);

  if (!user) {
    return null;
  }

  return (
    <Wrapper>
      <Header>
        <h1>Chi tiết người dùng</h1>
        <Button
          label="Quay lại"
          onClick={() => {
            redirect('/users');
          }}
        />
      </Header>
      <DetailsGrid>
        <DetailRow>
          <DetailLabel>Mã người dùng</DetailLabel>
          <DetailValue>{user.id}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Họ và tên</DetailLabel>
          <DetailValue>{user.name}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Email</DetailLabel>
          <DetailValue>{user.email}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Số điện thoại</DetailLabel>
          <DetailValue>{user.phoneNumber}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>CMND/CCCD</DetailLabel>
          <DetailValue>{user.ioc || '—'}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Vai trò</DetailLabel>
          <DetailValue>{user.roleName}</DetailValue>
        </DetailRow>
      </DetailsGrid>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  margin-top: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--admin-space-2);
  flex-wrap: wrap;

  button {
    padding: 0.5rem 1rem !important;
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  gap: 1.125rem;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  padding: clamp(1rem, 3vw, 1.75rem);
  border-radius: var(--admin-radius-lg);
  background: var(--admin-surface);
  border: 1px solid var(--admin-border-color);
  box-shadow: var(--admin-shadow-soft);
`;

const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--admin-space-2);
  padding: 1.125rem;
  border-radius: var(--admin-radius-lg);
  border: 1px solid rgba(226, 232, 240, 0.8);
  background: linear-gradient(165deg, rgba(248, 250, 252, 0.85), rgba(255, 255, 255, 0.98));
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: var(--admin-text-secondary);
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 0.08em;
`;

const DetailValue = styled.span`
  font-size: 16px;
  color: var(--admin-text-primary);
  letter-spacing: 0.01em;
`;
