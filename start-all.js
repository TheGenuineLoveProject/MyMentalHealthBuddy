import { spawn } from "child_process";

// helper: restart process on crash
function run(name, cmd, args) {
  const p = spawn(cmd, args, { stdio: "inherit" });
  p.on("exit", (code) => {
    console.log();
    setTimeout(() => run(name, cmd, args), 2000);
  });
}

// launch both servers
run("server", "npm", ["run", "dev:server"]);
run("client", "npm", ["run", "dev:client"]);
