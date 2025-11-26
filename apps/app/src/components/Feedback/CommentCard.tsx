import TimeAgo from 'javascript-time-ago';
import vi from 'javascript-time-ago/locale/vi.json';
import ReactTimeAgo from 'react-time-ago';
import styled from 'styled-components';

import { Avatar } from '../Common/Avatar';

TimeAgo.addDefaultLocale(vi);
TimeAgo.addLocale(vi);

type CommentCardProps = {
  name: string;
  content: string;
  timestamp: number;
};

export const CommentCard = (props: CommentCardProps) => {
  const { name, content, timestamp } = props;

  return (
    <Container>
      <HeaderRow>
        <Left>
          <Avatar name={name} size={40} />
          <NameBlock>
            <Sender>{name}</Sender>
            <Action>đã bình luận</Action>
          </NameBlock>
        </Left>
        <Right>
          <Time>
            <ReactTimeAgo date={timestamp} locale="vi" timeStyle="twitter-minute-now" />
          </Time>
        </Right>
      </HeaderRow>
      <Body>
        <Content>{content}</Content>
      </Body>
    </Container>
  );
};

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
  @media (max-width: 480px) {
    padding: 6px 0;
  }
  @media (max-width: 450px) {
    flex-direction: row;
    gap: 12px;
    align-items: flex-start;
  }
`;

const Body = styled.div`
  padding: 12px 14px;
  border: 1px solid #e6e6e9;
  background: #fafafc;
  border-radius: 10px;
  @media (max-width: 480px) {
    padding: 10px 12px;
    border-radius: 8px;
  }
  @media (max-width: 450px) {
    flex: 1;
  }
`;

const Sender = styled.span`
  display: block;
  font-weight: 700;
  font-size: 0.98rem;
  color: #0f172a;
  @media (max-width: 480px) {
    font-size: 0.92rem;
  }
`;

const Action = styled.span`
  color: #6b7280;
  font-size: 0.9rem;
  margin-left: 8px;
`;

const Time = styled.time`
  color: #9aa0a6;
  font-size: 0.85rem;
`;

const Content = styled.p`
  margin: 0;
  color: #111827;
  line-height: 1.6;
  @media (max-width: 480px) {
    font-size: 14px;
    line-height: 1.5;
  }
`;

const AvatarContainer = styled.div`
  display: none;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  @media (max-width: 450px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
`;

const Left = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;

  & > div {
    padding: 4px;
    border-radius: 50%;
  }
  @media (max-width: 450px) {
    gap: 6px;
    & > div {
      padding: 0;
    }
  }
`;

const NameBlock = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  @media (max-width: 450px) {
    display: none;
  }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media (max-width: 450px) {
    display: none;
  }
`;
