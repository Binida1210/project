import { violetDark } from '@radix-ui/colors';
import { CheckCircledIcon, MagnifyingGlassIcon, MobileIcon, ReaderIcon } from '@radix-ui/react-icons';
import React from 'react';
import styled from 'styled-components';

const AboutContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 24px;
`;

const HeroSection = styled.div`
  text-align: center;
  margin-bottom: 60px;
`;

const Title = styled.h1`
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  font-size: 42px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 20px;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 20px;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  font-size: 26px;
  font-weight: 600;
  color: ${violetDark.violet10};
  margin-bottom: 20px;
  border-bottom: 2px solid ${violetDark.violet10};
  padding-bottom: 8px;
`;
const Content = styled.div`
  font-size: 16px;
  color: #374151;
  line-height: 1.8;
  margin-bottom: 32px;

  p {
    margin-bottom: 20px;
    text-align: justify;
  }

  strong {
    color: ${violetDark.violet10};
    font-weight: 600;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin: 48px 0;
`;

const FeatureCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    border-color: ${violetDark.violet6};
  }
`;

const FeatureIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${violetDark.violet10};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);

  svg {
    width: 32px;
    height: 32px;
    color: white;
  }
`;

const FeatureTitle = styled.h3`
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
`;

const FeatureDescription = styled.p`
  font-size: 15px;
  color: #4b5563;
  line-height: 1.6;
  font-weight: 500;
`;


export const About: React.FC = () => {
  return (
    <AboutContainer>
      <HeroSection>
        <Title>Về iRent</Title>
        <Subtitle>
          Nền tảng cho thuê kho bãi thông minh, kết nối chủ sở hữu kho bãi với doanh nghiệp cần không gian lưu trữ
        </Subtitle>
      </HeroSection>

      <Section>
        <SectionTitle>Tầm nhìn của chúng tôi</SectionTitle>
        <Content>
          <p>
            iRent ra đời với sứ mệnh cách mạng hóa ngành cho thuê kho bãi tại Việt Nam. Chúng tôi hiểu rằng việc tìm
            kiếm không gian lưu trữ phù hợp là một thách thức lớn đối với nhiều doanh nghiệp, đặc biệt là các doanh
            nghiệp vừa và nhỏ.
          </p>
          <p>
            Với công nghệ hiện đại và giao diện thân thiện, iRent giúp rút ngắn thời gian tìm kiếm, tăng cường độ tin
            cậy và mang lại trải nghiệm tốt nhất cho cả chủ kho và người thuê.
          </p>
        </Content>
      </Section>

      <Section>
        <SectionTitle>Tính năng nổi bật</SectionTitle>
        <FeatureGrid>
          <FeatureCard>
            <FeatureIcon>
              <MagnifyingGlassIcon />
            </FeatureIcon>
            <FeatureTitle>Tìm kiếm thông minh</FeatureTitle>
            <FeatureDescription>
              Hệ thống tìm kiếm theo vị trí, diện tích, giá cả và nhiều tiêu chí khác
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <ReaderIcon />
            </FeatureIcon>
            <FeatureTitle>Đa dạng kho bãi</FeatureTitle>
            <FeatureDescription>
              Từ kho nhỏ đến kho lớn, phù hợp với mọi nhu cầu lưu trữ của doanh nghiệp
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <CheckCircledIcon />
            </FeatureIcon>
            <FeatureTitle>Đáng tin cậy</FeatureTitle>
            <FeatureDescription>Hệ thống đánh giá và xác thực giúp đảm bảo chất lượng dịch vụ</FeatureDescription>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon>
              <MobileIcon />
            </FeatureIcon>
            <FeatureTitle>Dễ sử dụng</FeatureTitle>
            <FeatureDescription>Giao diện đơn giản, trực quan, dễ dàng sử dụng cho mọi đối tượng</FeatureDescription>
          </FeatureCard>
        </FeatureGrid>
      </Section>

      <Section>
        <SectionTitle>Cam kết của chúng tôi</SectionTitle>
        <Content>
          <p>
            <strong>An toàn:</strong> Tất cả các kho bãi trên nền tảng đều được xác thực và đánh giá kỹ lưỡng về điều
            kiện an toàn, bảo mật.
          </p>
          <p>
            <strong>Minh bạch:</strong> Thông tin giá cả, điều kiện thuê được công khai rõ ràng, không phát sinh chi phí
            ẩn.
          </p>
          <p>
            <strong>Hỗ trợ 24/7:</strong> Đội ngũ chăm sóc khách hàng sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi.
          </p>
        </Content>
      </Section>

      {}
    </AboutContainer>
  );
};


