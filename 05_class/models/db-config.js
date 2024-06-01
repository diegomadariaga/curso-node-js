import dotenv from 'dotenv';
dotenv.config();
const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'movie_db',
    port: Number(process.env.MYSQL_PORT) || 3306,
};
export { config };
