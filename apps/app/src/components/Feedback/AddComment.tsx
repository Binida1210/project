import { isEmpty } from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import styled from 'styled-components';

import { useAuthStore } from '@/auth';
import { ClientCommentModel } from '@/models/comment.model';

import { Avatar } from '../Common/Avatar';
import { Button } from '../Common/Button';
import { TextAreaAutoSize } from '../Common/TextArea';

type AddCommentProp = {
  onCommentSent?: (comment: ClientCommentModel) => void;
};

export const AddComment = ({ onCommentSent }: AddCommentProp) => {
  const [comment, setComment] = useState('');
  const { user } = useAuthStore();

  const handleCommentSent = () => {
    if (!isEmpty(comment)) {
      onCommentSent?.({ content: comment, senderName: 'Mock user', date: moment().format() });
      setComment('');
    }
  };

  return (
    <Container>
      <div>
        <Avatar name={user?.name} size={40} />
      </div>
      <Textarea
        cacheMeasurements
        placeholder="Nhập bình luận"
        rows={1}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <SendButton onClick={handleCommentSent}>Bình luận</SendButton>
    </Container>
  );
};

const Container = styled.div`
  --comment-control-height: 52px;
  --comment-button-font-size: 15px;

  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  padding: 8px 6px;
  align-items: center;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & > div > div {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }
  background: transparent;
  border: none;
  border-radius: 8px;
  margin-bottom: 2rem;

  @media (max-width: 480px) {
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    gap: 8px;
    padding: 6px 8px;
    & > div > div {
      width: 36px;
      height: 36px;
      font-size: 14px;
    }
  }
  @media (max-width: 450px) {
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto;
    gap: 8px;
  }
`;

const Textarea = styled(TextAreaAutoSize)`
  border-radius: 8px;

  padding: calc((var(--comment-control-height) - 1em) / 2) 12px;
  line-height: 1em;
  display: block;
  width: 100%;
  resize: none;
  min-height: var(--comment-control-height);
  max-height: calc(var(--comment-control-height) * 2);
  background: #fafafa;
  @media (max-width: 480px) {
    padding: 8px 10px;
    min-height: 44px;
    font-size: 14px;
  }
`;

const SendButton = styled(Button)`
  min-width: 120px;
  height: var(--comment-control-height);
  font-size: var(--comment-button-font-size);

  @media (max-width: 520px) {
    min-width: 90px;
    grid-column: 1 / -1;
    justify-self: end;
  }
  @media (max-width: 480px) {
    min-width: 80px;
    grid-column: 2;
    grid-row: 2;
    justify-self: end;
    height: 40px;
    font-size: 14px;
  }
  @media (max-width: 450px) {
    grid-column: 3;
    grid-row: 1;
    justify-self: end;
  }
`;
