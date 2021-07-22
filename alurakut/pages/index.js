import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/Maingrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} alt="Foto do usuário" style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`} title="Nome do usuário" target="_blank" rel="noopener noreferrer" >
          @{props.githubUser}
        </a>
      </p>
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props) {

  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">{props.title} ({props.total})</h2>

      <ul>
        {props.items.slice(0, 6).map((itemAtual) => {
          return (
            <li key={itemAtual.id}>
              <a href={itemAtual.html_url} target="_blank" rel="noopener noreferrer" title="Site do usuário">
                <img src={itemAtual.avatar_url} alt="Avatar do usuário" />
                <span>{itemAtual.login}</span>
              </a>
            </li>
          );
        })}
      </ul>
      <hr />
      <p>
        <a className="boxLink" href={`/amigos`} >
          Ver todos
        </a>
      </p>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  // pega usuario do github
  const githubUser = props.githubUser;
  // pega numero de seguidores
  const [numerosSegui, setNumerosSegui] = React.useState([]);
  // lista os seguidores
  const [seguidores, setSeguidores] = React.useState([]);
  // lista quem o usario segue
  // COMUNIDADES
  const [comunidades, setComunidades] = React.useState([]);



  React.useEffect(function () {
    const urlNumeros = `https://api.github.com/users/${githubUser}`;
    fetch(urlNumeros)
      .then(resposta => resposta.json())
      .then(respostaJson => setNumerosSegui(respostaJson));

    const urlFollowers = `https://api.github.com/users/${githubUser}/followers`
    fetch(urlFollowers)
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta);
      })

    // API DATOCMS GraphQL Comunidades 
    fetch('https://graphql.datocms.com/', {
      method:'POST',
      headers: {
        'Authorization':'5ae062ae5306a8d80a28060f3327e6',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({"query": `query {
        allCommunities {
          id
          title
          imageUrl
          creatorSlug
        }
      }` })
    })
      .then((response) => response.json()) 
      .then((respostaCompleta) => {
        const comunidadesVindasDoDato = respostaCompleta.data.allCommunities;
        setComunidades(comunidadesVindasDoDato)

      })

  }, []);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>

        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">Bem vindo(a), {githubUser}!</h1>
            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">Crie sua comunidade</h2>
            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();
              const dadosDoForm = new FormData(e.target);

              const comunidade = {
                title: dadosDoForm.get('title'),
                imageUrl: dadosDoForm.get('image'),
                creatorSlug: githubUser
              }
              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(comunidade),
              })
                .then(async (response) => {
                  const dados = await response.json();
                  const comunidade = dados.registroCriado;
                  const comunidadesAtualizadas = [...comunidades, comunidade]
                  setComunidades(comunidadesAtualizadas);
                })
            }}>
              <div>
                <input
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div style={{ display: 'flex' }}>
                <input
                  placeholder="Coloque uma URL para usarmos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usarmos de capa"
                />
              </div>
              <button style={{ background: '#2E7BB4' }} >
                Criar comunidade
              </button>
            </form>
          </Box>
          <Box >
            <div style={{display:'flex', width:'100%', allingItems:'center'}} >
              <h2>Os mais seguidos da plataforma!</h2>
              <img src={'https://0201.nccdn.net/4_2/000/000/048/0a6/click-down.gif'} style={{width:'5%'}} />
            </div>
          </Box>
          <Box>
          <div>
            <div style={{display:'flex'}}>
              <img src={"https://www.lance.com.br/files/article_main/uploads/2021/06/13/60c67f90c645d.jpeg"} style={{width:'10%', height:'50px', borderRadius:'40px'}} /> 
              <h3 style={{marginTop:'10px', marginLeft:'5px'}}>@neymarjr</h3>
            </div>
            <img src= {"https://images.daznservices.com/di/library/GOAL/38/ff/neymar-peru-brasil-eliminatorias-2022-13102020_d36cnocyiu9e1bp808u6n1dac.jpg?t=630864805&quality=100"} style={{marginTop:'10px'}} />
          </div>
            <hr />
          <div>
            <div style={{display:'flex'}}>
              <img src={"https://www.gazetaesportiva.com/wp-content/uploads/imagem/2020/03/24/CR7-1.jpg"} style={{width:'10%',height:'50px', borderRadius:'40px'}} /> 
              <h3 style={{marginTop:'10px', marginLeft:'5px'}}>@CristianoRonaldo</h3>
            </div>
            <img src= {"https://static-wp-tor15-prd.torcedores.com/wp-content/uploads/2019/11/cristiano-ronaldo-portugal.jpg"} style={{marginTop:'10px'}} />
          </div>
          <hr />
          <div>
            <div style={{display:'flex'}}>
              <img src={"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Steve_Jobs_Headshot_2010-CROP2.jpg/1200px-Steve_Jobs_Headshot_2010-CROP2.jpg"} style={{width:'10%',height:'60px', borderRadius:'40px'}} /> 
              <h3 style={{marginTop:'20px', marginLeft:'5px'}}>@SteveJobs</h3>
            </div>
            <img src= {"https://exame.com/wp-content/uploads/2020/07/steve-jobs-com-o-iphone-de-primeira-gerac3a7c3a3o.jpg"} style={{marginTop:'10px'}} />
          </div>


      
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Amigos" items={seguidores} total={numerosSegui.followers} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>

            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={itemAtual.paginaUrl} target="_blank" rel="noopener noreferrer" title="Site da comunidade">
                      <img src={itemAtual.imageUrl} alt="Capa da comunidade" />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <hr />
          </ProfileRelationsBoxWrapper>
        </div>

      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);

  const token = cookies.USER_TOKEN;
  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
    .then((resposta) => resposta.json())

   if(!isAuthenticated) {
     return {
       redirect: {
         destination: '/login',
         permanent: false,
       }
     }
   }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    }, // will be passed to the page component as props
  }
}