import mysql from "mysql2"

export const db = mysql.createConnection({
  host:"wilproject.mysql.database.azure.com",
  user:"wilproject",
  password: "W!lproject1234",
  database:"social awareness campaign"
})