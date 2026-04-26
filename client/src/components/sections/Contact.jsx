import { useRef, useState } from "react";
import styled from "styled-components";
import emailjs from "@emailjs/browser";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
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
`;

const Title = styled.div`
  font-size: 52px;
  text-align: center;
  font-weight: 600;
  margin-top: 20px;
  color: ${({ theme }) => theme.text_primary};
`;

const Desc = styled.div`
  font-size: 18px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text_secondary};
`;

const ContactForm = styled.form`
  width: 95%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  background-color: rgba(17, 25, 40, 0.83);
  padding: 32px;
  border-radius: 12px;
  margin-top: 28px;
  gap: 12px;
`;

const ContactTitle = styled.div`
  font-size: 28px;
  margin-bottom: 6px;
  font-weight: 600;
`;

const ContactInput = styled.input`
  background-color: transparent;
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 8px;
  color: white;
`;

const ContactInputMessage = styled.textarea`
  background-color: transparent;
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 8px;
  color: white;
`;

const ContactButton = styled.button`
  background: purple;
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

const SuccessMsg = styled.p`
  color: #4caf50;
  text-align: center;
`;

const ErrorMsg = styled.p`
  color: red;
  text-align: center;
`;

const Contact = () => {
  const form = useRef();
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 ADD

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // 🔥 STOP DOUBLE SUBMIT
    setLoading(true);

    const formData = {
      from_name: form.current.from_name.value,
      from_email: form.current.from_email.value,
      message: form.current.message.value,
      subject: form.current.subject.value,
    };

    try {
      // ✅ Mail to YOU
      await emailjs.send(
        "service_ugimabu", // ✔️ apna service id
        "template_efkvohk", // ✔️ apna template id
        formData,
        "qL7HT9ENxj9nmtL3Y" // ✔️ apna public key
      );

      setStatus("SUCCESS");
      form.current.reset();
    } catch (error) {
      console.error(error);
      setStatus("ERROR");
    }

    setLoading(false);
  };

  return (
    <Container id="contact">
      <Wrapper>
        <Title>Contact</Title>
        <Desc>Feel free to reach out to me for opportunities!</Desc>

        <ContactForm ref={form} onSubmit={handleSubmit}>
          <ContactTitle>Email Me</ContactTitle>

          <ContactInput name="from_email" placeholder="Your Email" required />
          <ContactInput name="from_name" placeholder="Your Name" required />
          <ContactInput name="subject" placeholder="Subject" />
          <ContactInputMessage
            name="message"
            placeholder="Message"
            rows={4}
            required
          />

          {/* 🔥 BUTTON FIX */}
          <ContactButton type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </ContactButton>

          {status === "SUCCESS" && (
            <SuccessMsg>✅ Message sent successfully!</SuccessMsg>
          )}
          {status === "ERROR" && (
            <ErrorMsg>❌ Failed to send. Try again.</ErrorMsg>
          )}
        </ContactForm>
      </Wrapper>
    </Container>
  );
};

export default Contact;