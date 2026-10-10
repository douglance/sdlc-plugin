import path from "node:path";
import readline from "node:readline";
const [home, cwd, mode = "clean"] = process.argv.slice(2);
const order = ["initialize", "initialized", "skills/list", "config/read", "thread/start"];
let index = 0;
const input = readline.createInterface({ input: process.stdin });
input.on("line", (line) => {
  const message = JSON.parse(line);
  if (message.method !== order[index++]) {
    process.stderr.write("wrong request order");
    process.exit(9);
  }
  if (mode === "early") { process.stderr.write("fixture early exit"); process.exit(7); }
  if (mode === "delay") {
    process.stderr.write("fixture waiting");
    setTimeout(() => {}, 5000);
    return;
  }
  if (mode === "malformed") { process.stdout.write("not-json\n"); return; }
  if (message.method === "initialized") return;
  if (message.method === "config/read" && mode === "config-error") {
    process.stdout.write(JSON.stringify({ id: message.id, error: {
      code: -32000, message: "must-not-appear", data: { api_key: "must-not-appear" },
    } }) + "\n");
    return;
  }
  if (message.method === "config/read" && mode === "config-malformed") {
    process.stdout.write('{"id":3,"result":{"api_key":"must-not-appear"\n');
    return;
  }
  let result;
  if (message.method === "initialize") result = { codexHome: home, userAgent: "fixture/1", launchExecArgv: process.execArgv };
  if (message.method === "skills/list") result = { data: [{ cwd, errors: [], skills: [
    { name: "sdlc:first", path: path.join(home, "plugins/first/SKILL.md"), enabled: true, pluginId: "sdlc@sdlc-marketplace" },
    { name: "sdlc:second", path: path.join(home, "plugins/second/SKILL.md"), enabled: true, pluginId: "sdlc@sdlc-marketplace" },
    { name: "system", path: path.join(home, "skills/.system/SKILL.md"), enabled: true, scope: "system" },
  ] }] };
  if (message.method === "config/read") result = { config: {
    features: { apps: false, memories: false, hooks: false, multi_agent: false, multi_agent_v2: false,
      remote_plugin: false, tool_suggest: false, auth_elicitation: false },
    mcp_servers: {}, api_key: "must-not-appear", model_providers: { credential: "must-not-appear" },
  } };
  if (message.method === "thread/start") result = {
    cwd, instructionSources: [], approvalPolicy: "never", model: "fixture", modelProvider: "fixture",
    sandbox: { type: "readOnly", networkAccess: false },
  };
  process.stdout.write(JSON.stringify({ id: message.id, result }) + "\n");
});
