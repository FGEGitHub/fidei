const express = require('express')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const path = require('path')
const flash = require ('connect-flash')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')
const {database} = require('./src/keys')
const passport = require('passport')
const cors = require("cors");
const jwt = require('jsonwebtoken')
const keys = require('./src/keys')

//inicializacion
const app = express()
require('./src/lib/passport')
app.set('key',keys.key)

//settings

app.set('port', process.env.PORT || 4000)
app.set('views', path.join(__dirname,'views')) // indica donde esta la carpeta views 
app.engine('.hbs', exphbs.engine({  // define la localizacion de los laouts nav y footers
    defaultLayout:'main',
    layoutDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname:'.hbs',
    helpers: require('./src/lib/handlebars')
}))

app.set('view engine', '.hbs')


//middlwares
app.use(session({
    secret: 'faztmysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
}))

app.use(flash())
app.use(morgan('dev'))
app.use(express.urlencoded({extended:false})) // para recibir datos de formularios
app.use(express.json())
app.use(passport.initialize())
app.use(passport.session())
app.use(cors());



//globalvariables
app.use((req,res,next)=>{
    app.locals.success = req.flash('success')
    app.locals.success = req.flash('message')
    app.locals.user = req.user
    next();
})


//routes
app.use(require('./src/routes/index'))
app.use(require('./src/routes/authentication'))
app.use(`/src/links`, require('./src/routes/links'))
app.use(`/src/cuotas`, require('./src/routes/cuotas'))
app.use('/src/pagos', require('./src/routes/pagos'))
app.use('/src/usuario1', require('./src/routes/usuario1'))
app.use('/src/aprobaciones', require('./src/routes/aprobaciones'))
app.use('/src/constancias', require('./src/routes/constancias'))
app.use('/src/lotes', require('./src/routes/lotes'))
app.use('/src/chats', require('./src/routes/chats'))
app.use('/src/nivel3', require('./src/routes/nivel3'))

app.use(express.static(path.join(__dirname,'./pdfs')))
app.use(express.static(path.join(__dirname,'pdfs')))
//public  
app.use(express.static(path.join(__dirname, 'public') ))

app.use(express.static(path.join(__dirname, 'dbimages') ))

//start 
app.listen(app.get('port'), ()=>{
    console.log(`server onport`, app.get('port'))
})

