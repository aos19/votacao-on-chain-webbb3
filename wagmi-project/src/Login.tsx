import { useConnect, useConnectors } from 'wagmi';

function Login() {
  const { connect, error } = useConnect()
  const connectors = useConnectors()

  return (
    <div className='container px-4 py-5'>
        <div className='row flex-lg-row-reverse align-items-center g-5 py-5'>
            {/* Div que abrigará a imagem do mascote do BBB */}
            <div className='col-6'>
                <img src="https://inmagazine.ig.com.br/wp-content/uploads/2025/09/bbb.webp" className='d-block- mx-lg-auto img-fluid' width="700" height="500"/>
            </div>

            {/* Div que abrigará algumas informações iniciais da votação */}
            <div className='col-6'>
                <h1 className='display-5 fw-bold text-body-emphasis lh-1 mb-3'>Webbb3</h1>
                <p className='lead'>Votação On-Chain do BBB</p>
                <p className='lead mb-3'>Autentique-se com a sua carteira e deixe o seu voto para o próximo paredão!</p>

                <div>
                    {/* Botão que irá disparar um callback com uma função interna chamada connect
                        - O connect é responsável por carregar os conectores, isto é, os elementos ao qual a página está conectada, que é a carteira da Metamask, de modo que desejamos o primeiro elemento do array de conectores, que é o da Metamask
                     */}
                    <button 
                        type='button' 
                        onClick={() => connect({ connector: connectors[0]})}
                        className='btn btn-primary btn-lg px-4 me-md-2'>

                        {/* Inserindo no botão a imagem do Logo do MetaMask */}
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/MetaMask_Fox.svg/960px-MetaMask_Fox.svg.png" width="64" className='me-3'/>
                        Conectar com a Metamask
                    </button>
                </div>

                {/* Fazendou uma seção de preparo para erros: caso haja um erro, carregar a mensagem de erro, caso não, exibir uma string vazia */}
                <p className='message'>{error ? error.message : " "}</p>
            </div>
        </div>
    </div>
  )
}

export default Login
