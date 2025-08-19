db = db.getSiblingDB("db_Homologacao");

db.createUser({
  user: "root",
  pwd: "rootLab",
  roles: [
    { role: "readWrite", db: "db_Homologacao" }
  ]
});
