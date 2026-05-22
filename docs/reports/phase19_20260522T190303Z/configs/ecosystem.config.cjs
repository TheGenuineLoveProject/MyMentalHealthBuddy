module.exports = {
  apps: [{
    name: "mmhb",
    script: "npm",
    args: "run dev",
    autorestart: true,
    watch: false,
    max_memory_restart: "700M",
    env: {
      NODE_ENV: "production"
    }
  }]
}
