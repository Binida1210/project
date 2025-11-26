/* eslint-disable */
import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { violetDark } from '@radix-ui/colors';
import { Button as BaseButton } from '@/components/Common/Button/Button';

type ContactFormState = {
  message: string;
  name: string;
  subject: string;
  email: string;
};

const initialFormState: ContactFormState = {
  message: '',
  name: '',
  subject: '',
  email: '',
};

const contactChannels = [
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
    label: 'Văn phòng',
    value: '123 Le Loi, Quan 1, Thanh pho Ho Chi Minh',
    description: 'Tiếp đón trực tiếp theo lịch hẹn',
  },
];

const supportShortcuts = [
  {
    label: 'Trung tâm hỗ trợ',
    to: '/help',
    description: 'Kho kiến thức và hướng dẫn sử dụng nền tảng',
  },
  {
    label: 'Câu hỏi thường gặp',
    to: '/help#faq-section',
    description: 'Tổng hợp giải đáp nhanh cho người thuê và chủ kho',
  },
  {
    label: 'Đăng kho nhanh',
    to: '/create',
    description: 'Đăng kho của bạn chỉ trong vài bước đơn giản',
  },
];

export const Contact = () => {
  const [formState, setFormState] = useState<ContactFormState>(initialFormState);
  const [submitted, setSubmitted] = useState(false);

  const handleChange =
    (field: keyof ContactFormState) => (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.currentTarget;
      setFormState((prev) => ({ ...prev, [field]: value }));
      if (submitted) {
        setSubmitted(false);
      }
    };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setFormState(initialFormState);
  };

  return (
    <PageWrapper>
      <HeroSection>
        <HeroTitle>Liên hệ iRent</HeroTitle>
        <HeroSubtitle>
          Để lại thông tin và yêu cầu chi tiết. Đội ngũ hỗ trợ sẽ phản hồi trong vòng một ngày làm việc qua email hoặc
          điện thoại.
        </HeroSubtitle>
      </HeroSection>

      <ContactShell>
        <SupportColumn>
          <Panel>
            <PanelTitle>Kênh liên hệ trực tiếp</PanelTitle>
            <PanelList>
              {contactChannels.map((item) => (
                <PanelItem key={item.label}>
                  <PanelLabel>{item.label}</PanelLabel>
                  {item.href ? (
                    <PanelLink href={item.href}>{item.value}</PanelLink>
                  ) : (
                    <PanelValue>{item.value}</PanelValue>
                  )}
                  <PanelHint>{item.description}</PanelHint>
                </PanelItem>
              ))}
            </PanelList>
          </Panel>

          <Panel>
            <PanelTitle>Tài nguyên tự trợ</PanelTitle>
            <PanelList>
              {supportShortcuts.map((item) => (
                <PanelItem key={item.label}>
                  <PanelLink as={Link} to={item.to}>
                    {item.label}
                  </PanelLink>
                  <PanelHint>{item.description}</PanelHint>
                </PanelItem>
              ))}
            </PanelList>
          </Panel>
        </SupportColumn>

        <FormPanel onSubmit={handleSubmit}>
          <FormHeader>
            <FormTitle>Gửi yêu cầu hỗ trợ</FormTitle>
            <FormDescription>
              Điền thông tin dưới đây. Chúng tôi sẽ sử dụng thông tin này để liên hệ và giải quyết vấn đề của bạn.
            </FormDescription>
          </FormHeader>

          {submitted && (
            <SuccessBanner role="status">Yêu cầu đã được ghi nhận. iRent sẽ phản hồi sớm nhất có thể.</SuccessBanner>
          )}

          <FieldGrid>
            <Field>
              <Label htmlFor="contact-name">Họ và tên</Label>
              <Input
                required
                id="contact-name"
                name="name"
                placeholder="Nguyễn Văn A"
                value={formState.name}
                onInput={handleChange('name')}
              />
            </Field>
            <Field>
              <Label htmlFor="contact-email">Email</Label>
              <Input
                required
                id="contact-email"
                name="email"
                placeholder="ban@example.com"
                type="email"
                value={formState.email}
                onInput={handleChange('email')}
              />
            </Field>
          </FieldGrid>

          <Field>
            <Label htmlFor="contact-subject">Chủ đề</Label>
            <Input
              required
              id="contact-subject"
              name="subject"
              placeholder="Ví dụ: Hỗ trợ đăng kho"
              value={formState.subject}
              onInput={handleChange('subject')}
            />
          </Field>

          <Field>
            <Label htmlFor="contact-message">Nội dung</Label>
            <MessageArea
              required
              id="contact-message"
              name="message"
              placeholder="Mô tả yêu cầu hoặc thắc mắc của bạn..."
              rows={6}
              value={formState.message}
              onInput={handleChange('message')}
            />
          </Field>

          <FormFooter>
            <Hint>Bằng việc gửi biểu mẫu, bạn đồng ý để iRent liên hệ với bạn qua các thông tin đã cung cấp.</Hint>
            <SubmitButton type="submit">Gửi yêu cầu</SubmitButton>
          </FormFooter>
        </FormPanel>
      </ContactShell>
    </PageWrapper>
  );
};

const PageWrapper = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px 64px;
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 768px) {
    padding: 24px 16px 48px;
    gap: 24px;
  }
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 48px 0;
`;

const HeroTitle = styled.h1`
  margin: 0 0 12px 0;
  font-size: clamp(28px, 4vw, 36px);
  font-weight: 700;
  color: #0f172a;
`;

const HeroSubtitle = styled.p`
  margin: 0;
  max-width: 560px;
  margin: 0 auto;
  color: #64748b;
  line-height: 1.6;
  font-size: 16px;
`;

const ContactShell = styled.section`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  align-items: start;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const SupportColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Panel = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PanelTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
`;

const PanelList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const PanelItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const PanelLabel = styled.span`
  font-size: 12px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #94a3b8;
`;

const PanelLink = styled.a`
  color: ${violetDark.violet10};
  text-decoration: none;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
    color: ${violetDark.violet7};
  }
`;

const PanelValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
`;

const PanelHint = styled.span`
  font-size: 13px;
  color: #64748b;
`;

const FormPanel = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const FormHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
`;

const FormDescription = styled.p`
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
`;

const SuccessBanner = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0369a1;
  font-size: 14px;
  font-weight: 600;
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  min-width: 0;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
`;

const sharedInputStyles = `
  width: 100%;
  min-width: 0;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  font-size: 14px;
  line-height: 1.5;
  color: #0f172a;
  transition: border-color 200ms ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${violetDark.violet9};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Input = styled.input`
  ${sharedInputStyles}
`;

const MessageArea = styled.textarea`
  ${sharedInputStyles}
  resize: vertical;
`;

const FormFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 600px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Hint = styled.p`
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  max-width: 420px;
`;

const SubmitButton = styled(BaseButton)`
  width: 160px;
`;

