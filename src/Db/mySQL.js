import mysql from "mysql2/promise";

// const connect = async ()={
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: process.env.mysqlPassword,
        database: 'youtube',
      });
      connection.connect((error)=>{
        if (error) {
            throw error
        }
        console.log("mysql not connected", error);
              })


export default connection;
