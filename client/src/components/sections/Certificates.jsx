import React, { useState } from "react";
import styled from "styled-components";
import { certificates } from "../../data/constants";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-contnet: center;
  margin-top: 50px;
  padding: 0px 16px;
  position: rlative;
  z-index: 1;
  align-items: center;
`;

const Wrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  width: 100%;
  max-width: 1100px;
  gap: 12px;
  @media (max-width: 960px) {
    flex-direction: column;
  }
`;

const Title = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 768px) {
    margin-top: 12px;
    font-size: 32px;
  }
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const CardContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.card};
  border: 1px solid ${({ theme }) => theme.text_secondary + 20};
  border-radius: 16px;
  padding: 20px;
  box-shadow: rgba(23, 92, 230, 0.15) 0px 4px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const CertificatePreview = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid ${({ theme }) => theme.primary + 40};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1f2232;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  padding: 10px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    height: 190px;
    padding: 8px;
  }
`;

const PreviewLink = styled.a`
  width: 100%;
  display: block;
  text-decoration: none;
  border-radius: 12px;
  overflow: hidden;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  background: #ffffff;
  transition: transform 0.3s ease;
`;

const CertificateTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.text_primary};
  font-size: 22px;
  line-height: 1.4;
`;

const CertificateMeta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 14px;
`;

const CertificateDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.text_secondary};
  font-size: 15px;
  line-height: 1.7;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Tag = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.primary};
  background: ${({ theme }) => theme.primary + 20};
  padding: 6px 10px;
  border-radius: 999px;
`;

const ViewButton = styled.a`
  width: fit-content;
  text-decoration: none;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.white};
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: rgba(133, 76, 230, 0.35) 0px 10px 20px;
  }
`;

const CertificateCard = ({ certificate }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const hasValidImage = Boolean(certificate.image) && !imageFailed;
  const hasLink = Boolean(certificate.link);

  const previewContent = (
    <CertificatePreview>
      {hasValidImage ? (
        <PreviewImage
          src={certificate.image}
          alt={certificate.title}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span>{certificate.issuer}</span>
      )}
    </CertificatePreview>
  );

  return (
    <Card>
      {hasLink ? (
        <PreviewLink
          href={certificate.link}
          target="_blank"
          rel="noreferrer"
          aria-label={`View ${certificate.title}`}
        >
          {previewContent}
        </PreviewLink>
      ) : (
        previewContent
      )}

      <CertificateTitle>{certificate.title}</CertificateTitle>
      <CertificateMeta>
        {certificate.issuer} - {certificate.date}
      </CertificateMeta>
      <CertificateDescription>{certificate.description}</CertificateDescription>

      <TagContainer>
        {certificate.skills.map((skill, index) => (
          <Tag key={`${certificate.id}-skill-${index}`}>{skill}</Tag>
        ))}
      </TagContainer>

      {hasLink && (
        <ViewButton href={certificate.link} target="_blank" rel="noreferrer">
          View Certificate
        </ViewButton>
      )}
    </Card>
  );
};

const Certificates = () => {
  return (
    <Container id="Certificates">
      <Wrapper>
        <Title>Certificates</Title>
        <Desc
          style={{
            marginBottom: "40px",
          }}
        >
          A collection of certifications, virtual experiences, and learning
          achievements that reflect my practical skills and continuous growth.
        </Desc>

        <CardContainer>
          {certificates.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </CardContainer>
      </Wrapper>
    </Container>
  );
};

export default Certificates;
