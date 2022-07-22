import pkg from 'pg';

const {Poll} = pkg;

const connection = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

export default connection;