import { User } from "firebase/auth";
import { Link } from "react-router-dom";
import { styled } from "styled-components";

const NavigationContainer = styled.nav`
  width: 100%;
`;

const NavigationBox = styled.ul`
  width: 100%;
  padding: 0 10px 0 10px;
  margin: 20px auto;
  display: flex;
  justify-content: space-between;
  font-size: 20px;

  @media screen and (max-width: 550px) {
    font-size: 15px;
  }
`;

const NavigationButton = styled.li`
  border-left: 1px solid white;
  width: 100%;
  padding: 10px 15px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:last-child {
    border-right: 1px solid white;
  }
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

const HighlightText = styled.span`
  font-weight: 700;
`;

export default function Navigation({ userObj }: { userObj: User | null }) {
  return (
    <NavigationContainer>
      <NavigationBox>
        <NavigationButton>
          <Link to="/dm">
            <NavigationText>개인 메시지</NavigationText>
          </Link>
        </NavigationButton>
        <NavigationButton>
          <Link to="/">
            <NavigationText>홈</NavigationText>
          </Link>
        </NavigationButton>
        <NavigationButton>
          <Link to="/profile">
            <NavigationText>
              <HighlightText>
                {userObj?.displayName ?? userObj?.email?.split("@")[0]}
              </HighlightText>
              의 프로필
            </NavigationText>
          </Link>
        </NavigationButton>
      </NavigationBox>
    </NavigationContainer>
  );
}
