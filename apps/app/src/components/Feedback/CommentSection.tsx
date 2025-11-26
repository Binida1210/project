import { produce } from 'immer';
import moment from 'moment';
import { useState } from 'react';
import styled from 'styled-components';

import { CommentModel } from '@/models/comment.model';

import { ClientCommentModel } from '../../models/comment.model';
import { AddComment } from './AddComment';
import { CommentCard } from './CommentCard';

export type CommentSectionProps = {
  data?: ClientCommentModel[];
  resolveComment: (comment: ClientCommentModel) => Promise<CommentModel>;
};

export const CommentSection = ({ data = [], resolveComment }: CommentSectionProps) => {
  const [comments, setComments] = useState<ClientCommentModel[]>(
    data.sort((a, b) => moment(b.date).diff(moment(a.date))),
  );

  return (
    <CommentRoot>
      <AddComment
        onCommentSent={(comment) =>
          resolveComment(comment).then((resolved) => {
            setComments(
              produce((comments) => {
                comments.unshift(resolved);
              }),
            );
          })
        }
      />

      <List>
        {comments.map((it, index) => (
          <CommentCard key={index} content={it.content} name={it.senderName} timestamp={moment(it.date).valueOf()} />
        ))}
      </List>
    </CommentRoot>
  );
};

const CommentRoot = styled.div`
  width: 100%;
  background: #ffffff;
  border: 1px solid #e6e6e9;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
  @media (max-width: 480px) {
    padding: 10px;
    border-radius: 10px;
  }
`;

const List = styled.div`
  padding: 8px 6px 0 6px;
  margin-bottom: 6px;

  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 480px) {
    gap: 8px;
    padding: 8px 4px 0 4px;
  }
`;
