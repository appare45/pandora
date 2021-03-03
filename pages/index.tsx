import User_layout from '../components/User_layout';
import { AuthContext, AuthProvider } from '../context/Auth';

export function AddEvent() {
  function addEventToDb () {
    
  }
  return (
    <form>
      <h2 className="text-xl font-semibold">催し物を追加</h2>
      催し物名 <input type="text" className="border my-5" />
      <button
        type="submit"
        className="block bg-blue-400 p-5 py-2 rounded font-semibold shadow-lg"
      >
        作成
      </button>
    </form>
  );
}

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
