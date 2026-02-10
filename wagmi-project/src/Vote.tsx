// Página com uma estrutura de duas colunas, uma para cada candidato ser votado 

// Importando este hook para criar efeitos especiais na tela
// Trazendo o useState para criar estados para componentes, força a re-renderrização do componenente quando ele for atualizado
import { useEffect, useState } from "react";

// Fazendo a importação do wagmi para ler o smart-contract
import { readContract, writeContract } from "@wagmi/core";

// Importação wagmi que cuida da conexão da aplicação com a carteita cripto
import { useConfig } from "wagmi";

// Importando o ABI
import ABI from "./ABI.json";

// Criando um estado para o componente de resultado, baseado na mesma estrutura que criamos no smart-contract
type Voting = {
    option1: string;
    option2: string;
    votes1: number;
    votes2: number;
    maxDate: number;
}

export default function Vote() {
    // Variável que armazena o endereço do contrato
    const CONTRACT_ADDRESS = "0x0D8A1B26E7649e95B1a7fA9D9498DE48A1fb5E66";

    // Chamada da config para conectar a carteira
    const config = useConfig();

    // Criando um estado para a mensagem
    const [message, setMessage] = useState<string>("");

    // Dados vazios das votações
    const [voting, setVoting] = useState<Voting>({ maxDate: 0, option1: "", option2: "", votes1: 0, votes2: 0 });

    // Exibir os resultados dos votos ao usuário
    const [showVotes, setShowVotes] = useState<number>(0);

    // Passando o hook para dentro da página, que gerará o efeito de leitura do contrato, ou seja, a leitura do número de votos de cada participante
    useEffect(() => {
        // Passando infos importantes: o código do contrato e código de abi (código que resume o contrato e suas funções), o chainID (id da minha blockchain, a que está sendo usada no nosso contrato)
       readContract(config, {
        address: CONTRACT_ADDRESS,
        abi: ABI,
        chainId: config.chains[0].id,
        functionName: "getCurrentVoting",
        // Esta função não possui parâmetros
        args: []
       })

       // Retorno do read contract sendo capturado (promise com sucesso)
       .then(result => {
        console.log("Current Voting: ");

        // Convertendo o resultado para o tipo de dados que criamos para a votação
        const voting = result as Voting;

        setVoting(voting);
    })

       // Tratando o erro da Promise
       .catch(err => {
            console.log("Error while reading the contract: ", err)
            setMessage(err.message);
       })
    }, [])
    // Aqui logo em cima, passando um array vazio para o efeito ser disparado uma vez apenas quando a tela for atualizada 


    // Função para detectar se a votação passou de sua data máxima
    function isExpired() {
        return Number(voting.maxDate) < (Date.now() / 1000);
    }

    function getMaxDate() {
        return new Date(Number(voting.maxDate) * 1000).toLocaleString("pt-BR");
    }

    // Função para a imagem dos participantes
    function getImageUrl(name: string) {
        switch(name) {
            case "Arthur" : return "https://github.com/aos19/imagem.png/blob/main/foto3x4.jpeg";
            case "Mônica" : return "https://www.syngenta.com.br/sites/g/files/kgtney466/files/styles/main_media_small/public/media/image/2023/02/14/Narjara%20Cantelmo2.png?itok=tg6Ptm69";
           // default: return "";
        }
    }

    function doVote(choice: number) {
        writeContract(config, {
            address: CONTRACT_ADDRESS,
            abi: ABI,
            chainId: config.chains[0].id,
            functionName: "addVote",
            args: [choice],
        })
        .then(() => {
            setShowVotes(choice);
            setMessage("Voto registrado com sucesso! Resultados parciais sujeitos a alteração minuto a minuto");
        })

        .catch(err => {
            console.log("Error while writing to the contract: ", err);
            setMessage("Erro ao registrar o voto: " + err.message);
        })
    }

    function btnVote2Click() {
        setMessage("Conectando à carteira... aguarde...");
        doVote(2);
    }

    function btnVote1Click() {
        setMessage("Conectando à carteira... aguarde...");
        doVote(1);
    }

    // Assim que o usuário votar, a blockchain pode demorar um pouco para atualizar a contagem. Essa função irá incrementar o voto recém-feito, "artificialmente"
    function getVotesCount(option: number) {
        if (option === 1) {
            return showVotes === option ? Number(voting.votes1) + 1 : Number(voting.votes1);
        } else {
            return showVotes === option ? Number(voting.votes2) + 1 : Number(voting.votes2);   
        }
    }

     return (
    <div className='container px-4 py-5'>
      <div className='row align-items-center'>
        <h1 className='display-5 fw-bold text-body-emphasis lh-1 mb-3'>Webbb3</h1>
        <p className='lead'>Votação on-chain do BBB.</p>
        {
          isExpired()
            ? <p className='lead mb-3'>Votação encerrada. Confira abaixo os resultados.</p>
            : <p className='lead mb-3'>Você tem até {getMaxDate()} para deixar seu voto em um dos participantes abaixo para que ele saia do programa.</p>
        }
      </div>
      <div className='row flex-lg-row-reverse align-items-center g-5 py-5'>

        {/* Exibindo os participantes */}
        <div className='col-1'></div>
        <div className='col-5'>
            {/* Preenchendo os dados do segundo participante */}
          <h3 className='my-2 d-block mx-auto' style={{ width: 250 }}>{voting.option2}</h3>
          <img src={getImageUrl(voting.option2)} className='d-block mx-auto img-fluid rounded' width={250} height={250} />
          {
            // Botão para caso a votação estiver encerrada
            isExpired() || showVotes > 0
              ? <button className='btn btn-secondary p-3 my-2 d-block mx-auto' style={{ width: 250 }} disabled={true}>{getVotesCount(2)}</button>
              : <button className='btn btn-primary p-3 my-2 d-block mx-auto' style={{ width: 250 }} onClick={btnVote2Click}>Quero que saia este</button>
          }
        </div>
        <div className='col-5'>
          <h3 className='my-2 d-block mx-auto' style={{ width: 250 }}>{voting.option1}</h3>
          <img src={getImageUrl(voting.option1)} className='d-block mx-auto img-fluid rounded' width={250} height={250} />
          {
            isExpired() || showVotes > 0
              ? <button className='btn btn-secondary p-3 my-2 d-block mx-auto' style={{ width: 250 }} disabled={true}>{getVotesCount(1)}</button>
              : <button className='btn btn-primary p-3 my-2 d-block mx-auto' style={{ width: 250 }} onClick={btnVote1Click}>Quero que saia este</button>
          }
        </div>
        <div className='col-1'></div>
      </div>
      <div className='row align-items-center'>
        <p className='message'>{message}</p>
      </div>
    </div>
  )
}