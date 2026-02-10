// Importando o Wagmi e o hook useConnection para gerenciar a conexão com a carteira
import { useConnection } from 'wagmi';

import Login from "./Login";
import Vote from "./Vote";


export default function App() {
  const connection = useConnection();

  return (
    <>
      {
        // Se a conexão se estabelecer, será renderizada a tela de votação, caso não, a tela de login  
        connection.status === 'connected' ? <Vote /> : <Login />   
      }
    </>
  )
}