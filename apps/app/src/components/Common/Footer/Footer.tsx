import { violetDark } from '@radix-ui/colors';
import {
  ClockIcon,
  EnvelopeClosedIcon,
  HomeIcon,
  InstagramLogoIcon,
  LinkedInLogoIcon,
  MobileIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background: #1f2937;
  color: #ffffff;
  padding: 40px 0 20px;
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 25px;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

// Special footer boxes (Service / Support) that should be hidden on small screens
const FooterBox = styled(FooterSection)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px 0;
  color: ${violetDark.violet10};
`;

const FooterLink = styled(Link)`
  color: #d1d5db;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;

  &:hover {
    color: ${violetDark.violet10};
    text-decoration: underline;
  }
`;

const FooterText = styled.p`
  color: #d1d5db;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  /* On narrow screens show contact info in two columns (two items per row) */
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px 12px;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #d1d5db;

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
`;

const SocialLink = styled.a`
  color: #d1d5db;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    color: ${violetDark.violet10};
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid #374151;
  margin-top: 30px;
  padding-top: 20px;
  text-align: center;
`;

const Copyright = styled.p`
  color: #9ca3af;
  font-size: 13px;
  margin: 0;
`;

const BrandName = styled.span`
  color: ${violetDark.violet10};
  font-weight: 600;
`;

// Main footer component for the application
export const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <SectionTitle>Về iRent</SectionTitle>
          <FooterText>
            Nền tảng cho thuê kho bãi thông minh, kết nối chủ sở hữu kho bãi với doanh nghiệp cần không gian lưu trữ. An
            toàn, tiện lợi, đáng tin cậy.
          </FooterText>
          <SocialLinks>
            <SocialLink aria-label="Twitter" href="#">
              <TwitterLogoIcon />
            </SocialLink>
            <SocialLink aria-label="LinkedIn" href="#">
              <LinkedInLogoIcon />
            </SocialLink>
            <SocialLink aria-label="Instagram" href="#">
              <InstagramLogoIcon />
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterBox>
          <SectionTitle>Dịch vụ</SectionTitle>
          <FooterLink to="/home">Tìm kiếm kho bãi</FooterLink>
          <FooterLink to="/create">Đăng kho cho thuê</FooterLink>
          <FooterLink to="/list">Quản lý kho của tôi</FooterLink>
          <FooterText>Đánh giá & bình luận</FooterText>
          <FooterText>Hỗ trợ hợp đồng thuê</FooterText>
        </FooterBox>

        <FooterBox>
          <SectionTitle>Hỗ trợ</SectionTitle>
          <FooterLink to="/help">Câu hỏi thường gặp</FooterLink>
          <FooterLink to="/contact">Liên hệ hỗ trợ</FooterLink>
          <FooterText>Hướng dẫn cho thuê kho</FooterText>
          <FooterText>Quy định an toàn</FooterText>
          <FooterText>Chính sách thanh toán</FooterText>
        </FooterBox>

        <FooterSection>
          <SectionTitle>Thông tin liên hệ</SectionTitle>
          <ContactInfo>
            <ContactItem>
              <HomeIcon /> 123 Le Loi, Quan 1, Ho Chi Minh
            </ContactItem>
            <ContactItem>
              <MobileIcon /> 1900 1234 (Hotline 24/7)
            </ContactItem>
            <ContactItem>
              <EnvelopeClosedIcon /> support@irent.vn
            </ContactItem>
            <ContactItem>
              <ClockIcon /> Hỗ trợ 24/7 - Kể cả ngày lễ
            </ContactItem>
          </ContactInfo>
        </FooterSection>
      </FooterContent>

      <FooterBottom>
        <Copyright>
          © 2025 <BrandName>iRent</BrandName> - Nền tảng cho thuê kho bãi thông minh. Tất cả quyền được bảo lưu.
        </Copyright>
      </FooterBottom>
    </FooterContainer>
  );
};
