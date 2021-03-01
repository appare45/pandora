import User_layout from './../component/User_layout';
import { AuthContext, AuthProvider } from '../context/Auth';

export default function Home() {
  return (
    <User_layout>
      <AuthContext.Consumer>
        {(name) =>
          !!name.currentUser && <h1>{name.currentUser.displayName}</h1>
        }
      </AuthContext.Consumer>
    </User_layout>
  );
}
