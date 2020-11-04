//express tem o poder de controlar rotas
const express = require('express');

const { uuid, isUuid } = require('uuidv4')

//assim a aplicação está criada
const app = express();

//atribuindo que o express vai entender requisicoes em formato json
app.use(express.json());

/**
 * TIPOS DE PARAMETROS
 * 
 * query params: filtros e paginacao (vem da url)
 * rout params: serve para identificar os recursos ATUALIZAR/DELETAR
 * request body: conteúdo na hora de criar ou atualizar um recurso (JSON)
 */

/**
 * MIDDLEWARE
 * 
 * É um interceptador de requisisções que ele pode:
 *     - interromper totalmente a requisção(tipo, essa requisição aqui não precisa continuar, então ele interrompe ela)
 *     - alterar dados da requisição
 * A gente pode usar um middleware quando queremos que um trecho de codigo seja disparado automaticamente em 1 ou mais rotas da aplicação
 * Um exemplo bem pratico é um log, que você pode colocar para ser disparado cada vez que uma rota GET,PUT,POST e etc for acionada
 * 
 */

const projects = [];

//criando nosso middleware
//também podemos chamar quantos middlewares quisermos
//também podemos chamar os middlewares somente nos metodos que precisarmos
function logRequests(request, response, next) {
    const { method, url } = request;

    const logLabel = `[${method.toUpperCase()}] ${url}`

    console.time(logLabel);

    next();//se não chamar esse cara ele interrompe a requisição e não vai para o proximo middleware ou sequencia da applicação, ex metodo POST

    console.timeEnd(logLabel);
}

//criando middleware 2 - retorna se o uuid é valido
function validateProjectId(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({ error: 'Invalid Project Id.' });
    }
    return next();
}

app.use(logRequests);//se declarar assim nesse fluxo ele vai enviar para todas as requisições, mas da pra implementar somente na requisição que eu quiser
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
    const { title } = request.query;

    const results = title
        ? projects.filter(project => project.title.includes(title))
        : projects;

    return response.json(results);
});

app.post('/projects', (request, response) => {

    const { title, owner } = request.body;

    const project = { id: uuid(), title, owner };
    projects.push(project);


    return response.json(project);
});

app.put('/projects/:id', (request, response) => {

    const { id } = request.params;
    const { title, owner } = request.body;validateProjectId
    //quando não existe o valor no array o retorno é -1 e por isso vericamos se for < 0
    if (projectIndex < 0) {
        return response.status(400).json({ error: "Project not found." });
    }

    //aqui a gente cria um objeto novo zerado e com as informações atualizadas do update
    const project = {
        id,
        title,
        owner,
    };

    //passando para o objeto nessa posição do index o objeto novo que contem os dados atualizados acima
    projects[projectIndex] = project;

    return response.json(project);
});

app.delete('/projects/:id', (request, response) => {

    const { id } = request.params;
    const projectIndex = projects.findIndex(project => project.id === id);

    //quando não existe o valor no array o retorno é -1 e por isso vericamos se for < 0
    if (projectIndex < 0) {
        return response.status(400).json({ error: "Project not found." });
    }

    //splice retira algo do array e o numero 1 é para informar o que quero retirar do array depois do que eu encontrei,
    //nesse caso quero retirar só esse cara
    projects.splice(projectIndex, 1);

    return response.status(204).send();
});

// ENDPOINT TESTE
app.get('/projects/array/:id', (request, response) => {
    const projects = [];
    const { id } = request.params;

    const results = id
        ? projects.filter(project => project.id.includes(id))
        : projects;

    return response.json(results);
});


app.listen(4040, () => {
    console.log('Subiu o Malacado!');
});