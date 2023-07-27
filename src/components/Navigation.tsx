import { User } from "firebase/auth";
import { Link } from "react-router-dom";
import { styled } from "styled-components";

const NavigationContainer = styled.nav`
  width: 100%;
`;

const NavigationBox = styled.ul`
  width: 400px;
  padding: 0;
  gap: 20px;
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
`;

const NavigationButton = styled.li`
  border: 1px solid white;
  width: 100%;
  text-align: center;
  padding: 10px 15px;
  border-radius: 8px;
`;

const NavigationText = styled.span`
  width: 100%;
  height: 100%;
  transition: all 0.3s ease;
  color: white;

  &:hover {
    color: #74b9ff;
    transition: all 0.3s ease;
  }
`;

export default function Navigation({ userObj }: { userObj: User | null }) {
  return (
    <NavigationContainer>
      <NavigationBox>
        <NavigationButton>
          <Link to="/">
            <NavigationText>홈</NavigationText>
          </Link>
        </NavigationButton>
        <NavigationButton>
          <Link to="/profile">
            <NavigationText>
              {userObj?.displayName ?? userObj?.email?.split("@")[0]}의 프로필
            </NavigationText>
          </Link>
        </NavigationButton>
      </NavigationBox>
    </NavigationContainer>
  );
}
