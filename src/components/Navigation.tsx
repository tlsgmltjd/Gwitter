import { Link } from "react-router-dom";
import { styled } from "styled-components";

const NavigationContainer = styled.nav`
  width: 500px;
  margin: 0 auto;
  padding: 20px 0 0 0;

  @media screen and (max-width: 700px) {
    width: 100%;
  }
`;

const NavigationBox = styled.ul`
  width: 100%;
  padding: 0 50px 0 50px;
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
`;

const NavigationButton = styled.li`
  width: 100%;
  padding: 10px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavigationText = styled.span`
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  color: white;
  border: 1px solid white;
  border-radius: 15px;
  padding: 20px;

  &:hover {
    background-color: #74b9ff;
    transition: all 0.3s ease;
  }
`;

export default function Navigation() {
  return (
    <NavigationContainer>
      <NavigationBox>
        <NavigationButton>
          <Link to="/dm">
            <NavigationText>👥</NavigationText>
          </Link>
        </NavigationButton>
        <NavigationButton>
          <Link to="/">
            <NavigationText>🏠</NavigationText>
          </Link>
        </NavigationButton>
        <NavigationButton>
          <Link to="/profile">
            <NavigationText>😀</NavigationText>
          </Link>
        </NavigationButton>
      </NavigationBox>
    </NavigationContainer>
  );
}
