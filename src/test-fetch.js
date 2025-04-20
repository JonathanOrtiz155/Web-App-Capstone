import fetch from "node-fetch";

async function test() {
  const res = await fetch("https://api.github.com");
  console.log("Status:", res.status);
}
test();
