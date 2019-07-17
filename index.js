const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const sqlite = require('sqlite')
const path = require('path')
const getToday = require ('./public/lib/date')


const dbConnection = sqlite.open(path.resolve(__dirname, 'banco.sqlite'), { Promise })

const port = process.env.PORT || 3000

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')   
app.use(express.static(path.join(__dirname, 'public'))) 
app.use(bodyParser.urlencoded({ extended: true }))


//HOME
app.get('/', async(req, res) => {
    const db = await dbConnection
    const gruposDB = await db.all('select * from grupos;')
    const publicadores = await db.all('select * from publicadores;')
    const { dayNumber, dayString, year, month, weekDay }= getToday.getToday()
    const goodMorning = getToday.goodMorning()
    const getTime = getToday.getTime()

    const grupos = gruposDB.map(gru => {
        return {
            ...gru,
            publicadores: publicadores.filter(publicador => publicador.grupo === gru.id)
        }
    })

    res.render('home', {
        grupos, 
        publicadores,
        grupos,
        dayNumber, 
        dayString, 
        year, 
        month, 
        weekDay,
        goodMorning,
        getTime
    })
})
//RELATÓRIO

app.get('/relatorios', async(req, res) => {
    const db = await dbConnection
    const Junho = await db.all('select * from Junho;')

    res.render('relatorios/home', {
        Junho

    })
})

// app.get('/relatorios/grupo/:id', async(req, res) => {
//     const { id } = req.params
//     const db = await dbConnection
//     const grupo = await db.get(`select * from grupos where id = ${id}`)
//     const publicadores = await db.all(`select * from publicadores where grupo=${id};`)
//     const months = { Janeiro:1,
//                     Fevereiro:2,
//                     Março:3,
//                     Abril:4,
//                     Maio:5,
//                     Junho:6,
//                     Julho:7,
//                     Agosto:8,
//                     Setembro:9,
//                     Outubro:10,
//                     Novembro:11,
//                     Dezembro:12 }
//     const months2 = Object.keys(months)
//     const months3 = Object.values(months)

//         console.log(months2)
//     res.render('relatorios/grupo', {
//         grupo,
//         publicadores,
//         months2,
//         months3
//     })
// })



//ASSISTENCIA

app.get('/assistencia', async(req, res) => {
    const { dayNumber, dayString, year, month, weekDay } = getToday.getToday()
    const db = await dbConnection
    const grupos = await db.all('select * from grupos;') 
    res.render('assistencia/home', {
        grupos,
        dayNumber, 
        dayString, 
        year, 
        month, 
        weekDay
    })
})

app.get('/assistencia/grupos-ter', async(req, res) => {
    const db = await dbConnection
    const grupos = await db.all('select * from grupos;')

    res.render('assistencia/grupos-ter', {
        grupos
    })
})

app.get('/assistencia/grupos-sab', async(req, res) => {
    const db = await dbConnection
    const grupos = await db.all('select * from grupos;')

    res.render('assistencia/grupos-sab', {
        grupos
    })
})

app.get('/assistencia/publicadores-ter/:id', async(req, res) => {
    const { getTerTab } = getToday.getToday()
    const db = await dbConnection
    const { id } = req.params
    const grupo = await db.get(`select * from grupos where id = ${id}`)
    //const publicadores = await db.all(`select * from publicadores where grupo=${id};`)
    const publicadores = await db.all(`select * from assistencia${getTerTab} where grupo=${id};`)


    res.render('assistencia/publicadores-ter', {
        publicadores,
        grupo        
    })
}) 

app.get('/assistencia/publicadores-sab/:id', async(req, res) => {
    const { getSabTab } = getToday.getToday()
    const { id } = req.params
    const db = await dbConnection
    const grupo = await db.get(`select * from grupos where id = ${id}`)
    //const publicadores = await db.all(`select * from publicadores where grupo=${id};`)
    const publicadores = await db.all(`select * from assistencia${getSabTab} where grupo=${id};`)

    res.render('assistencia/publicadores-sab', {
        publicadores,
        grupo
    })
}) 


app.post('/assistencia/publicadores-ter/:id', async(req, res) => {
    const { getTerTab } = getToday.getToday()
    const db = await dbConnection
    const publicadores = Object.keys(req.body)

    publicadores.forEach( async publicador => {
        await db.run(`update assistencia${getTerTab} set presente = 1 where publicador = '${publicador}'`)
    })

    res.redirect('/assistencia')
})


app.post('/assistencia/publicadores-sab/:id', async(req, res) => {
    const { getSabTab } = getToday.getToday()
    const { id } = req.params
    const db = await dbConnection
    const publicadores = Object.keys(req.body) // vem dos checkbox da view
    const publicadoresDB = await db.all(`select * from assistencia${getSabTab} where grupo=${id};`)
    

    let pubs = []
    publicadoresDB.forEach( pub => {
        pubs.push(pub.publicador)
    })

    publicadores.forEach( async publicador => {
        await db.run(`update assistencia${getSabTab} set presente = 1 where publicador = '${publicador}'`)
    })
    
    res.redirect('/assistencia')
})




//GRUPOS

app.get('/grupos', async(req, res) => {
    const db = await dbConnection
    const grupos = await db.all('select * from grupos;')

    res.render('grupos/home', {
        grupos
    })
})

app.get('/grupo/:id', async(req, res) => {
    const { id } = req.params
    const db = await dbConnection
    const grupo = await db.get(`select * from grupos where id = ${id}`)
    const publicadores = await db.all(`select * from publicadores where grupo=${id};`)

    res.render('grupos/grupo', {
        publicadores,
        grupo
    })
})

app.get('/publicador/:id', async(req, res) => {
    const { id } = req.params
    const db = await dbConnection
    const publicador = await db.get(`select * from publicadores where id=${id};`)
    const {grupo, nome, pioneiro, servo, anciao, tvjw, diretrizes, dc50 } = publicador
    res.render('grupos/publicador', {
        publicador,
        grupo,
        nome,
        pioneiro,
        servo,
        anciao,
        tvjw,
        diretrizes,
        dc50
    })
})

//ADMIN

app.get('/admin', (req, res) => {
    res.render('admin/home')
})

app.get('/admin/grupos', async(req, res) => {
    const db = await dbConnection
    const grupos = await db.all('select * from grupos;')
    res.render('admin/grupos', {
        grupos
    })
})

app.get('/admin/grupos/novo', (req, res) => {
    res.render('admin/novo-grupo')
})
app.post('/admin/grupos/novo', async(req, res) => {
    const { grupo } = req.body
    const db = await dbConnection
    await db.run(`insert into grupos(grupo) values('${grupo}')`)
    res.redirect('/admin/grupos')
})

app.get('/admin/grupos/editar/:id', async(req, res) => {
    const { id } = req.params
    const db = await dbConnection
    const grupos = await db.get(`select * from grupos where id = ${id}`)
    res.render('admin/editar-grupo', {
        grupos
    })
})
app.post('/admin/grupos/editar/:id', async(req, res) => {
    const { id } = req.params
    const { grupo } = req.body
    const db = await dbConnection
    await db.run(`update grupos set grupo = '${grupo}' where id = ${id}`)
    res.redirect('/admin/grupos')
})

app.get('/admin/grupos/delete/:id', async(req, res) => {
    const { id } = req.params
    const db = await dbConnection
    await db.run(`delete from grupos where id = ${id}`)
    res.redirect('/admin/grupos')
})

app.get('/admin/publicadores', async(req, res) => {
    const db = await dbConnection
    const publicadores = await db.all('select * from publicadores')
    res.render('admin/publicadores', {
        publicadores
    })
})

app.get('/admin/publicadores/novo', async(req, res) => {
    const db = await dbConnection
    const publicadores = await db.all('select * from publicadores')
    const grupos = await db.all('select * from grupos;')
    res.render('admin/novo-publicador', {
        publicadores,
        grupos
    })
})
app.post('/admin/publicadores/novo', async(req, res) => {
    let { nome, grupo, pioneiro, servo, anciao, tvjw, diretrizes, dc50 } = req.body
    const db = await dbConnection

    pioneiro == null ? pioneiro = 0 : pioneiro = 1
    servo == null ? servo = 0 : servo = 1
    anciao == null ? anciao = 0 : anciao = 1
    tvjw == null ? tvjw = 0 : tvjw = 1
    diretrizes == null ? diretrizes = 0 : diretrizes = 1
    dc50 == null ? dc50 = 0 : dc50 = 1

    await db.run(`insert into publicadores(nome, grupo, pioneiro, servo, anciao, tvjw, diretrizes, dc50)
     values('${nome}',${grupo}, ${pioneiro}, ${servo},${anciao},${tvjw},${diretrizes},${dc50});`)
     
     init() // INIT BANCO DE DADOS
     res.redirect('/admin/publicadores')
})



app.get('/admin/publicadores/editar/:id', async(req, res) => {
    const db = await dbConnection
    const grupos = await db.all('select * from grupos')
    const publicador = await db.get('select * from publicadores where id = ' + req.params.id)
    res.render('admin/editar-publicador', {
        grupos, publicador
    })
})
app.post('/admin/publicadores/editar/:id', async(req, res) => {
    let { nome, grupo, pioneiro, servo, anciao, tvjw, diretrizes, dc50 } = req.body
    const { id } = req.params
    const db = await dbConnection

    pioneiro == null ? pioneiro = 0 : pioneiro = 1
    servo == null ? servo = 0 : servo = 1
    anciao == null ? anciao = 0 : anciao = 1
    tvjw == null ? tvjw = 0 : tvjw = 1
    diretrizes == null ? diretrizes = 0 : diretrizes = 1
    dc50 == null ? dc50 = 0 : dc50 = 1

    await db.run(`update publicadores set grupo = ${grupo}, 
        nome = '${nome}',
        pioneiro = ${pioneiro},
        servo = ${servo},
        anciao = ${anciao},
        tvjw = ${tvjw},
        diretrizes = ${diretrizes},
        dc50 = ${dc50} 
        where id = ${id}`)
    res.redirect('/admin/publicadores')
})

app.get('/admin/publicadores/delete/:id', async(req, res) => {
    const db = await dbConnection
    await db.run('delete from publicadores where id = ' + req.params.id + '')
    res.redirect('/admin/publicadores')
})
  
//BANCO DE DADOS

const init = async() => {
    const { getSabDB, getTerDB, getSabTab, getTerTab, month } = getToday.getToday()
    const today = new Date
    const db = await dbConnection

    await db.run(`create table if not exists grupos (id INTEGER PRIMARY KEY, 
                                                            grupo TEXT)`)

    await db.run(`create table if not exists publicadores (id INTEGER PRIMARY KEY, 
                                                            grupo INTEGER, 
                                                            nome TEXT,
                                                            pioneiro INTEGER,
                                                            servo INTEGER,
                                                            anciao INTEGER,
                                                            tvjw INTEGER,
                                                            diretrizes INTEGER,
                                                            dc50 INTEGER)`)

    await db.run(`create table if not exists data (id INTEGER PRIMARY KEY,
                                                            data TEXT,
                                                            mes TEXT,
                                                            ano TEXT, 
                                                            UNIQUE(data))`)

    await db.run(`create table if not exists assistencia${getSabTab} (id INTEGER PRIMARY KEY,
                                                            publicador TEXT,
                                                            presente INTEGER,
                                                            grupo INTEGER,
                                                            UNIQUE(publicador) )`) 
    
    await db.run(`create table if not exists assistencia${getTerTab} (id INTEGER PRIMARY KEY,
                                                            publicador TEXT,
                                                            presente INTEGER,
                                                            grupo INTEGER,
                                                            UNIQUE(publicador))`)    

    await db.run(`create table if not exists ${month} (id INTEGER PRIMARY KEY,
                                                                dias TEXT,
                                                                UNIQUE(dias))`)  
                                                                
    await db.run(`create table if not exists meses (id INTEGER PRIMARY KEY,
                                                                mes TEXT,
                                                                UNIQUE(mes))`)   
                                                                
    const publicadores = await db.all('select * from publicadores')


    const getMonth = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

    await db.run(`insert or ignore into data (data) values('${getTerDB}')`)
    await db.run(`insert or ignore into data (data) values('${getSabDB}')`)

    await db.run(`insert or ignore into ${month} (dias) values('${getTerTab}')`)
    await db.run(`insert or ignore into ${month} (dias) values('${getSabTab}')`)

     getMonth.forEach( async month => {
         await db.run(`insert or ignore into meses (mes) values('${month}')`)
     })
    // insere os publicadores ao DB
    publicadores.forEach( async pub => {
        await db.run(`insert or ignore into assistencia${getTerTab} (publicador, presente, grupo) values('${pub.nome}', 0, ${pub.grupo} )`)
    })
    publicadores.forEach( async pub => {
        await db.run(`insert or ignore into assistencia${getSabTab} (publicador, presente, grupo) values('${pub.nome}', 0, ${pub.grupo} )`)
    })
                                                            
}

init() // INIT BANCO DE DADOS

app.listen(port, (err) => {
    if (err) {
        console.log('Não foi possível iniciar o servidor do JW. Erro:', err)
    } else {
        console.log(`Server running on port ${port}`)
    }
})