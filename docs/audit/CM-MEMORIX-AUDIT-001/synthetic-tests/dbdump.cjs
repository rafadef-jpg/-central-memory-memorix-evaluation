const D=require("../../../../node_modules/better-sqlite3");const db=new D(process.argv[2]||"fx/home/.memorix/data/memorix.db",{readonly:true});
console.log(db.prepare("select name from sqlite_master where type='table' order by name").all().map(r=>r.name).join(", "));
console.log("fk",db.pragma("foreign_keys",{simple:true}),"jm",db.pragma("journal_mode",{simple:true}),"uv",db.pragma("user_version",{simple:true}));
console.log("observations cols:",db.prepare("pragma table_info(observations)").all().map(c=>c.name).join(","));
for(const r of db.prepare("select * from observations").all()){console.log(JSON.stringify(r).slice(0,1200))}
