/* eslint-disable */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { violetDark } from '@radix-ui/colors';
import { Button as BaseButton } from '@/components/Common/Button/Button';

const faqItems = [
  {
    question: 'Làm sao để chọn được kho bãi phù hợp?',
    answer:
      'Bạn có thể sử dụng bộ lọc theo khu vực, khoảng giá và diện tích để thu hẹp lựa chọn. Nếu vẫn chưa rõ, hãy liên hệ đội ngũ hỗ trợ để được gợi ý nhanh.',
  },
  {
    question: 'Tôi đặt lịch xem kho thì bao lâu sẽ nhận được phản hồi?',
    answer:
      'Sau khi chọn kho bãi và gửi yêu cầu, chủ kho sẽ liên hệ trong vòng 24 giờ làm việc. Bạn cũng có thể theo dõi tình trạng tại mục Kho bãi của tôi.',
  },
  {
    question: 'Làm thế nào để đăng kho mới lên nền tảng?',
    answer:
      'Bạn cần đăng nhập bằng tài khoản chủ kho, điền đầy đủ thông tin, ảnh thực tế và giấy tờ liên quan. Hệ thống sẽ kiểm duyệt trước khi hiển thị cho người thuê.',
  },
  {
    question: 'Chi phí thuê bao gồm những khoản nào?',
    answer:
      'Giá hiển thị là giá thuê theo tháng. Một số kho có thể yêu cầu đặt cọc hoặc phụ phí dịch vụ; chi tiết sẽ được thể hiện rõ trong hợp đồng.',
  },
  {
    question: 'Tôi nghi ngờ thông tin sai lệch thì cần làm gì?',
    answer:
      'Bạn hãy sử dụng tính năng báo cáo vi phạm trong trang chi tiết kho hoặc gửi thông tin cho chúng tôi qua email hỗ trợ kèm bằng chứng.',
  },
];

const contactInfo = [
  {
    label: 'Email',
    value: 'support@irent.vn',
    description: 'Phản hồi trong 24 giờ làm việc',
    href: 'mailto:support@irent.vn',
  },
  {
    label: 'Hotline',
    value: '1900 1234',
    description: 'Từ 8:00 – 21:00 hằng ngày',
    href: 'tel:19001234',
  },
  {
    label: 'Địa chỉ',
    value: '123 Le Loi, Quan 1, Thanh pho Ho Chi Minh',
    description: 'Làm việc trực tiếp theo lịch hẹn',
  },
];

export const Help = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const navigate = useNavigate();

  const handleToggle = (index: number) => {
    setActiveFaq((current) => (current === index ? null : index));
  };

  return (
    <PageWrapper>
      <IntroSection>
        <IntroTitle>Trung tâm trợ giúp</IntroTitle>
        <IntroText>
          Tổng hợp những câu hỏi thường gặp từ người thuê và chủ kho. Chọn mục bạn quan tâm hoặc liên hệ trực tiếp với
          chúng tôi.
        </IntroText>
      </IntroSection>

      <ContentLayout>
        <FaqSection>
          <SectionHeading>Câu hỏi thường gặp</SectionHeading>
          <FaqList>
            {faqItems.map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <FaqItem key={item.question}>
                  <FaqQuestion $open={isOpen} aria-expanded={isOpen} onClick={() => handleToggle(index)}>
                    <QuestionText>{item.question}</QuestionText>
                    <FaqToggle $open={isOpen}>{isOpen ? '−' : '+'}</FaqToggle>
                  </FaqQuestion>
                  {isOpen && (
                    <FaqAnswer>
                      <p>{item.answer}</p>
                    </FaqAnswer>
                  )}
                </FaqItem>
              );
            })}
          </FaqList>
        </FaqSection>

        <ContactSection>
          <SectionHeading>Liên hệ nhanh</SectionHeading>
          <SectionText>Chọn kênh phù hợp để nhận được phản hồi từ đội ngũ iRent.</SectionText>
          <ContactList>
            {contactInfo.map((item) => (
              <li key={item.label}>
                <label>{item.label}</label>
                {item.href ? (
                  <ContactLink href={item.href}>{item.value}</ContactLink>
                ) : (
                  <ContactValue>{item.value}</ContactValue>
                )}
                <ContactHint>{item.description}</ContactHint>
              </li>
            ))}
          </ContactList>
          <ContactButton type="button" onClick={() => navigate('/contact')}>
            Gửi yêu cầu liên hệ
          </ContactButton>
        </ContactSection>
      </ContentLayout>
    </PageWrapper>
  );
};

const PageWrapper = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 24px 64px;
  display: flex;
  flex-direction: column;
  gap: 48px;
`;

const IntroSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const IntroTitle = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 600;
  color: #111827;
`;

const IntroText = styled.p`
  margin: 0;
  max-width: 640px;
  color: #4b5563;
  line-height: 1.6;
`;

const ContentLayout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 3fr) minmax(220px, 2fr);
  gap: 32px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const FaqSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionHeading = styled.h2`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  color: #1f2937;
`;

const FaqList = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e5e7eb;
`;

const FaqItem = styled.article`
  border-bottom: 1px solid #e5e7eb;
  padding: 2px 0;
`;

const FaqQuestion = styled.button.attrs({ type: 'button' })<{ $open: boolean }>`
  width: 100%;
  padding: 18px 0;
  border: none;
  background: transparent;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  text-align: left;
  font-size: 16px;
  font-weight: 500;
  color: ${({ $open }) => ($open ? '#0f172a' : '#111827')};
  cursor: pointer;
  transition: color 200ms ease;
  outline: none;

  &:hover {
    color: #0f172a;
  }
`;

const QuestionText = styled.span`
  flex: 1;
  line-height: 1.5;
`;

const FaqToggle = styled.span<{ $open: boolean }>`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  border: 1px solid ${({ $open }) => ($open ? '#111827' : '#d1d5db')};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 500;
  color: ${({ $open }) => ($open ? '#ffffff' : '#4b5563')};
  background: ${({ $open }) => ($open ? '#111827' : 'transparent')};
  transition:
    background 200ms ease,
    color 200ms ease,
    border-color 200ms ease;
`;

const FaqAnswer = styled.div`
  padding: 8px 0 20px;
  color: #4b5563;
  line-height: 1.6;

  p {
    margin: 0;
  }
`;

const ContactSection = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  background: #f9fafb;
  box-shadow: 0 12px 20px rgba(15, 23, 42, 0.04);
`;

const SectionText = styled.p`
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
`;

const ContactList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;

  li {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-bottom: 14px;
    border-bottom: 1px solid #e7ecf2;
  }

  label {
    font-size: 12px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #9ca3af;
  }

  li:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const ContactButton = styled(BaseButton)`
  margin-top: 8px;
  align-self: flex-start;
  width: 180px;
`;

const ContactLink = styled.a`
  font-size: 15px;
  color: ${violetDark.violet10};
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    text-decoration: underline;
    color: ${violetDark.violet7};
  }
`;

const ContactValue = styled.span`
  font-size: 15px;
  color: ${violetDark.violet10};
  font-weight: 600;
`;

const ContactHint = styled.span`
  font-size: 13px;
  color: #64748b;
`;

