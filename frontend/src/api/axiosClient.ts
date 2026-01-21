import axios from 'axios';

// Creamos una instancia "pre-configurada" de axios
const client = axios.create({
    // Usamos '/api' porque Vite (tu servidor frontend) hará de intermediario
    // y redirigirá esto a http://localhost:8080/api
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default client;