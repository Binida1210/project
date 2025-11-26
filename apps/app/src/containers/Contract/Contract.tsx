import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@/components/Common/Button';
import { useContract } from '@/hooks';
import { useWarehouseResolver } from '@/resolver/WarehouseResolver';

export function Contract() {
  const { warehouse } = useWarehouseResolver();
  const { viewContract } = useContract();
  const navigate = useNavigate();

  useEffect(() => {
    const base64 = warehouse?.rentedInfo?.contractBase64;
    if (warehouse?.rented && base64) {
      viewContract({ containerId: 'contract', base64 });
    }
  }, [warehouse, viewContract]);

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate(`/warehouse/${warehouse.id}`);
  };

  return (
    <PagePaddingSmall>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ marginBottom: '1rem' }}>
          <Button color="secondary" size="sm" onClick={handleBack}>
            Quay lại
          </Button>
        </div>
        <div
          id="contract"
          style={{
            height: '120dvh',
            maxHeight: '180vh',
            width: '100%',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        ></div>
      </div>
    </PagePaddingSmall>
  );
}

const PagePaddingSmall = styled.div.attrs({ className: 'page-padding' })`
  padding: 3rem 6rem;
`;
