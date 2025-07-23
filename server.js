// Express backend para enviar certificados
import express from 'express';
import multer from 'multer';
import nodemailer from 'nodemailer';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer();

app.use(cors());

app.post('/api/send-certificate', upload.single('file'), async (req, res) => {
  try {
    const { email } = req.body;
    const file = req.file;
    if (!email || !file) return res.status(400).send('Datos incompletos');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    await transporter.sendMail({
      from: `ENPRES Certificados <${process.env.MAIL_USER}>`,
      to: email,
      subject: 'Tu certificado de finalización',
      text: '¡Felicidades! Adjuntamos tu certificado de finalización del módulo ENPRES.',
      attachments: [{ filename: file.originalname, content: file.buffer }]
    });

    res.status(200).send('Certificado enviado con éxito');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al enviar el certificado');
  }
});

app.listen(5001, () => console.log('Servidor backend corriendo en http://localhost:5001'));