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

app.get('/assistencia', async(req, res) => {
    const db = await dbConnection
    const grupos = await db.all('select * from grupos;')
    const { dayNumber, dayString, year, month, weekDay }= getToday.getToday()
    res.render('assistencia', {
        grupos,
        dayNumber, 
        dayString, 
        year, 
        month, 
        weekDay
    })
})

app.get('/assistencia-grupo', async(req, res) => {
    const db = await dbConnection
    const grupos = await db.all('select * from grupos;')

    res.render('assistencia-grupo', {
        grupos
    })
})

app.get('/assistencia-pub/:id', async(req, res) => {
    const { id } = req.params
    const db = await dbConnection
    const grupo = await db.get(`select * from grupos where id = ${id}`)
    const publicadores = await db.all(`select * from publicadores where grupo=${id};`)

    res.render('assistencia-pub', {
        publicadores,
        grupo
    })
})

app.get('/grupos', async(req, res) => {
    const db = await dbConnection
    const grupos = await db.all('select * from grupos;')

    res.render('grupos', {
        grupos
    })
})

app.get('/grupo/:id', async(req, res) => {
    const { id } = req.params
    const db = await dbConnection
    const grupo = await db.get(`select * from grupos where id = ${id}`)
    const publicadores = await db.all(`select * from publicadores where grupo=${id};`)
    console.log(grupo)

    res.render('grupo', {
        publicadores,
        grupo
    })
})

app.get('/grupo/publicador/:id', async(req, res) => {
    const { id } = req.params
    const db = await dbConnection
    const publicador = await db.get(`select * from publicadores where id=${id};`)
    const {grupo, nome, pioneiro, servo, anciao, tvjw, diretrizes, dc50 } = publicador
    res.render('publicador', {
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

//PUBLICADORES

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
  
const init = async() => {
    const db = await dbConnection
    await db.run('create table if not exists grupos (id INTEGER PRIMARY KEY, grupo TEXT)')
    await db.run(`create table if not exists publicadores (id INTEGER PRIMARY KEY, 
                                                            grupo INTEGER, 
                                                            nome TEXT,
                                                            pioneiro INTEGER,
                                                            servo INTEGER,
                                                            anciao INTEGER,
                                                            tvjw INTEGER,
                                                            diretrizes INTEGER,
                                                            dc50 INTEGER,
                                                            presente INTEGER)`)
}

init()

app.listen(port, (err) => {
    if (err) {
        console.log('Não foi possível iniciar o servidor do JW. Erro:', err)
    } else {
        console.log(`Server running on port ${port}`)
    }
})