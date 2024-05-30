import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface FutureMessageProps {
  authorName?: string;
  salutation?: string;
  message?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "";

export const FutureMessage = ({
  authorName,
  salutation,
  message,
}: FutureMessageProps) => {
  const previewText = `Someone just sent you a message from the past, take your time to read it :)`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>

      <Body style={main}>
        <Container style={container}>
          <Section style={{ display: "flex", justifyContent: "center" }}>
            <Img
              src={`https://files.edgestore.dev/vpiomkeluqm7cogd/xrayImage/_public/c9a173c0-bf37-4495-b778-8f3f02774342.jpeg`}
              width="300"
              height="150"
              alt="Ripple"
            />
          </Section>

          <Section style={{ paddingBottom: "20px" }}>
            <Row>
              <Text style={heading}>{salutation}</Text>
              <Text style={review}>{message}</Text>

              <Button style={button} href="https://ripple-delta.vercel.app/">
                Send a message to the future
              </Button>
            </Row>
          </Section>

          <Hr style={hr} />
        </Container>
      </Body>
    </Html>
  );
};

export default FutureMessage;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#484848",
};

const paragraph = {
  fontSize: "18px",
  lineHeight: "1.4",
  color: "#484848",
};

const review = {
  ...paragraph,
  padding: "24px",
  backgroundColor: "#f2f3f3",
  borderRadius: "4px",
};

const button = {
  backgroundColor: "#007FFF",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "18px",
  paddingTop: "19px",
  paddingBottom: "19px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
};

const hr = {
  borderColor: "#cccccc",
  margin: "20px 0",
};
