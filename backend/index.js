// importaciones y configuracion inicial
const express = require('express'); //para crear la pagina web 
const cors = require('cors'); // para comunicacion entre el frontend y el backend
const { PrismaClient } = require('@prisma/client'); // prisma para poder escribir en javascript en vez de SQL
const { clerkMiddleware, getAuth } = require('@clerk/express');

const app = express();
const prisma = new PrismaClient();

// intermediarios
app.use(cors({
    origin: 'https://habit-tracker-mu-gules.vercel.app'
})); //permite las peticiones http del frontend en vercel al backend en railway pero no externos
app.use(express.json()); // acepta los textos JSON del post y los convierte en objetos de javascript
app.use(clerkMiddleware()); // clerk intercepta las requests, lee su token (userId) y los verifica

// obtener los habitos con get
app.get('/api/habits', async (req, res) => {
    const {userId} = getAuth(req)
    if(!userId) return res.status(401).json({error: 'no autenticado'})

    const habits = await prisma.habit.findMany({
        where: { userId }
    }) //el ORM pide las filas a postgreSQL

    const habitosFormateados = habits.map(h => ({
        ...h,
        completions: JSON.parse(h.completions) //SQLite no guarda arrays, lo guardamos como texto plano y despues conviertimos de nuevo a array, para pruebas uso SQLite, para la web PostgreSQL
    }))
    res.json(habitosFormateados)
})

// crear los habitos con post
app.post('/api/habits', async(req, res) => {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const {name, icon, color} = req.body
    const habitoNuevo = await prisma.habit.create({ //insertamos la info en la base de datos
        data: {
            name,
            icon,
            color,
            completions: JSON.stringify([]), //convertimos a un array nuevamente, empieza vacio
            userId
        }
    })
    res.json({...habitoNuevo, completions: []})
})

// actualizar los habitos completados con put
app.put('/api/habits/:id', async (req, res) => {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const {id} = req.params //parametros
    const {completions} = req.body 
    const actualizarHabito = await prisma.habit.update({
        where: { id: parseInt(id), userId }, //buscamos por el id del habito
        data: {
            completions: JSON.stringify(completions)
        }
    })
    res.json({ ...actualizarHabito, completions})
})

// borrar habito con delete
app.delete('/api/habits/:id', async (req, res) => {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const {id} = req.params
    await prisma.habit.delete({
        where: {id: parseInt(id), userId}
    })
    res.json({success: true})
})

app.listen(3000, () => console.log('servidor listo en http://localhost:3000'))