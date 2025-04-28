import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Client } from "pg";
const location = dirname(fileURLToPath(import.meta.url));
const app = express();
const postdb = new Client({
  connectionString:
    "postgresql://postgres:GNnDFR6hbxMxu1AB@db.czffmxxxvpbnxxywbuli.supabase.co:5432/postgres",
  ssl: {
    rejectUnauthorized: false,
  },
});
postdb.connect();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
var todotitle = [];
var tododes = [];
var count = 0;
app.get("/", async (req, res) => {
  console.log("t1");
  const result = await postdb.query(
    "select Title, Description from datasource"
  );
  todotitle = [];
  console.log("t2");
  tododes = [];
  result.rows.forEach((d1) => {
    todotitle.push(d1.title);
    tododes.push(d1.description);
  });

  res.render("index.ejs", { title: todotitle, description: tododes });
});
app.post("/data", async (req, res) => {
  console.log(req.body.titlevalue);
  console.log(req.body.desvalue);
  console.log(tododes.length);
  const nums = await postdb.query(
    "insert into datasource(id, title,description)  values ($1,$2,$3)",
    [tododes.length + 1, req.body.titlevalue, req.body.desvalue]
  );

  res.redirect("/");
});
app.post("/delete", async (req, res) => {
  console.log(req.body.titledelete);
  await postdb.query("delete from datasource where title=$1", [
    req.body.titledelete,
  ]);
  res.redirect("/");
});
const port=process.env.PORT || 3000;
app.listen(port, (req, res) => {
  console.log("successfully");
});
