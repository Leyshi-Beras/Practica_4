const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get('/contactos', async (req, res) => {
    try {
        const response = await fetch('http://www.raydelto.org/agenda.php');
        const contactos = await response.json();
        res.json(contactos);
    } catch (error) {
        console.error('Error al obtener contactos:', error);
        res.status(500).json({ error: 'Error al obtener contactos' });
    }
});

app.post('/contactos', async (req, res) => {
    const { nombre, apellido, telefono } = req.body;

    if (!nombre || !apellido || !telefono) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const nuevoContacto = { nombre, apellido, telefono };

    try {
        const response = await fetch('http://www.raydelto.org/agenda.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoContacto),
        });

        if (!response.ok) {
            throw new Error('Error al agregar el contacto');
        }

        res.json({ mensaje: 'Contacto agregado exitosamente', contacto: nuevoContacto });
    } catch (error) {
        console.error('Error al agregar contacto:', error);
        res.status(500).json({ error: 'Error al agregar contacto' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
