import { User } from "firebase/auth";
import { Link } from "react-router-dom";

export default function Navigation({ userObj }: { userObj: User | null }) {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">홈</Link>
        </li>
        <li>
          <Link to="/profile">
            {userObj?.displayName ?? userObj?.email?.split("@")[0]}의 프로필
          </Link>
        </li>
      </ul>
    </nav>
  );
}
