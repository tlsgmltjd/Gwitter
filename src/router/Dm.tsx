import { styled } from "styled-components";

const Container = styled.div`
  width: 100%;
`;

const TestText = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 80px;
  font-size: 20px;
  font-weight: 700;
`;

export default function Dm() {
  return (
    <>
      <Container>
        <TestText>DM ⚒️</TestText>
      </Container>
    </>
  );
}
