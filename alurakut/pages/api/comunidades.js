import {SiteClient} from 'datocms-client'

export default async function recebedorDeRequests(request, response){
    if(request.method === 'POST'){
        const TOKEN = '243ff6af3c38907361a80bbd38129c';
        const client = new SiteClient(TOKEN);

        const registroCriado =  await client.items.create({
            itemType: '976139',
            ...request.body
            //title : "teste",
            //imageUrl: "https://github.com/ggsales.png",
            //creatorSlug: "ggsales"
        })
        response.json({
            dados: 'Algum dado qualquer',
            registroCriado: registroCriado,
        })
        return;
    }    
    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem'
    })
}