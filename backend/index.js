// importaciones y configuracion inicial
const express = require('express'); //para crear la pagina web 
const cors = require('cors'); // para comunicacion cruzada frontend-backend
const { PrismaClient } = require('@prisma/client');
const { clerkMiddleware, getAuth } = require('@clerk/express');

const app = express();
const prisma = new PrismaClient();

// intermediarios, interceptan la peticion http y la convierte en json
app.use(cors()); 
app.use(express.json());
app.use(clerkMiddleware()); // Clerk intercepta cada request

// obtener los habitos con get
app.get('/api/habits', async (req, res) => {
    const {userID} = getAuth(req)
    if(!userID) return res.status(401).json({error: 'no autenticado'})

    const habits = await prisma.habit.findMany() //el ORM pide las filas a SQLite
    const habitosFormateados = habits.map(h => ({
        ...h,
        completions: JSON.parse(h.completions) //SQLite no guarda arrays, lo guardamos como texto plano y despues conviertimos de nuevo a array
    }))
    res.json(habitosFormateados)
})

// crear los habitos con post
app.post('/api/habits', async(req, res) => {
    const { userId } = getAuth(req);
    console.log('userId:', userId); // log temporal
    console.log('headers:', req.headers.authorization); // log temporal
    if (!userId) return res.status(401).json({ error: 'No autenticado' });

    const {name, icon, color} = req.body
    const habitoNuevo = await prisma.habit.create({ //insertamos la info en la base de datos
        data: {
            name,
            icon,
            color,
            completions: JSON.stringify([]) //convertimos a un array nuevamente, empieza vacio
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
        where: { id: parseInt(id) }, //buscamos por el id del habito
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
        where: {id: parseInt(id)}
    })
    res.json({success: true})
})

app.listen(3000, () => console.log('servidor listo en http://localhost:3000'))