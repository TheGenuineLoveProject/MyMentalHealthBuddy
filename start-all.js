import { spawn } from "child_process";
function delay(ms){return new Promise(r=>setTimeout(r,ms));}
async function run(name, cmd, args){
  while(true){
    const p=spawn(cmd,args,{stdio:"inherit",env:{...process.env}});
    await new Promise(r=>p.on("exit",r));
    console.log("[warn]",name,"crashed — restarting in 3s...");
    await delay(3000);
  }
}
(async()=>{
  run("server","npm",["run","dev:server"]);
  await delay(3500); // prevent port race
  run("client","npm",["run","dev:client"]);
})();
