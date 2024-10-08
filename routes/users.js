const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { client } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { codigo_usuario, contrasenia_usuario} = req.body;
  
     try {
        // Realiza una consulta SQL para obtener el usuario con el nombre proporcionado
        const query = 'SELECT * FROM usuarios WHERE codigo_usuario = $1';
        const result = await client.query(query, [codigo_usuario]);
  
        // Verifica si se encontró un usuario con ese nombre
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales incorrectas.' });
        }
  
        // Compara la contraseña proporcionada con la almacenada en la base de datos
        const hashedPassword = result.rows[0].contrasenia_usuario;  // Ajusta el nombre del campo
        const passwordMatch = await bcrypt.compare(contrasenia_usuario, hashedPassword);
  
        if (!passwordMatch) {
          return res.status(401).json({ error: 'Contraseña incorrecta.', details: 'La comparación de contraseñas no coincidió.' });
      }
  
        // Si las credenciales son válidas, emite un token JWT
        const token = jwt.sign({ codigo_usuario }, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '1h' });
        res.json({ token });
  
    } catch (error) {
        console.error('Error al realizar la autenticación', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });

  router.post('/registroUsuarios', async (req, res) => {
    const { nombres_usuario, apellidos_usuario, codigo_usuario, contrasenia_usuario, rol_id, estado_usuario } = req.body;
  
    try {
        // Verifica si el usuario ya existe en la base de datos
        const existingUserQuery = 'SELECT * FROM usuarios WHERE codigo_usuario = $1';
        const existingUserResult = await client.query(existingUserQuery, [codigo_usuario]);
  
        if (existingUserResult.rows.length > 0) {
            return res.status(400).json({ error: 'El usuario ya existe.' });
        }
  
        // Encripta la contraseña antes de almacenarla en la base de datos
        const hashedPassword = await bcrypt.hash(contrasenia_usuario, 10);
  
        // Inserta el nuevo usuario en la base de datos con la contraseña encriptada
        const insertUserQuery = `INSERT INTO usuarios (nombres_usuario, apellidos_usuario, codigo_usuario, 
                                    contrasenia_usuario, rol_id, estado_usuario) VALUES ($1, $2, $3, $4, $5, $6)`;
        await client.query(insertUserQuery, [nombres_usuario, apellidos_usuario, codigo_usuario, hashedPassword, rol_id, estado_usuario]);
  
        // Devuelve una respuesta exitosa
        res.status(201).json({ message: 'Usuario registrado con éxito.' });
  
    } catch (error) {
        console.error('Error al registrar el usuario', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
  });

// para obtener todos los usuarios
router.get('/', authenticateToken,  async (req, res) => {
    
    const query = 'SELECT * FROM usuarios ORDER BY id_usuario';
  
    try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener los usuarios'. error);
        res.status(400).json({ error: 'Error al obtener los usuarios' });
    }      
  });

  router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
  
    const query = `SELECT * FROM usuarios WHERE id_usuario = '${id}'`;
  
       try {
        const result = await client.query(query);
        res.status(200).json(result.rows);
       } catch(error) {
            console.log('Error al obtener un usuario', error);
            res.status(400).json({ error: 'Error al obtener el usuario' }); 
        }
  });

  router.put('/cambiar_estadoUsuario/:id', authenticateToken, async (req, res) =>{
    const { id } = req.params;
    const { estado_usuario } = req.body;
  
    const query = `UPDATE usuarios SET estado_usuario = $1 WHERE id_usuario = '${id}'`;
    const values = [estado_usuario];
  
    try {
        await client.query(query, values);
        res.status(200).json({ message: 'Estado del usuario actualizado exitosamente' });
    } catch (error) {
        console.log('Error al actualizar el estado del usuario', error);
        res.status(400).json({ error: 'Error al actualizar el estado del usuario' });
    }
  });

  module.exports = router;

