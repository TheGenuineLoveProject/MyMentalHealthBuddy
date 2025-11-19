import localtunnel from "localtunnel";

(async () => {
  const tunnel = await localtunnel({ port: 3000 });
  console.log(`✅ Your secure Canva URL: ${tunnel.url}`);
  console.log("⚡ Keep this Replit tab open or Canva link will close.");
})();