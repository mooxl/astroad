import * as p from "@clack/prompts";
import color from "picocolors";
import dotenv from "dotenv";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
dotenv.config({ path: "../.env" });

const changeEnv = (key, value) => {
  const envPath = path.resolve(process.cwd(), "../.env");
  let envFile = fs.readFileSync(envPath, "utf8");
  envFile = envFile.replace(new RegExp(`^${key}=.*$`, "m"), `${key}=${value}`);
  fs.writeFileSync(envPath, envFile);
};

const canceled = (value) => {
  if (p.isCancel(value)) {
    p.cancel("Operation cancelled.");
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "production" && process.env.NAME === "astroad") {
  p.intro(color.inverse(" Welcome to Astroad! Let's get you set up. "));
  const name = await p.text({
    message: "What's the name of your project?",
    placeholder: "Astroad",
  });
  canceled(name);
  const mongoViaDocker = await p.confirm({
    message: "Do you want to start the database for Payload via Docker?",
    default: true,
  });
  canceled(mongoViaDocker);
  if (mongoViaDocker) {
    let dockerRunning;
    try {
      execSync("docker info &>/dev/null");
      dockerRunning = true;
    } catch {
      dockerRunning = false;
    }
    if (dockerRunning) {
      const username = await p.text({
        message: "What should be the username for the database?",
        placeholder: "admin",
      });
      canceled(username);
      const password = await p.text({
        message: "What should be the password for the database?",
        placeholder: "password",
      });
      canceled(password);
      const port = await p.text({
        message: "What port should the database run on?",
        placeholder: "27017",
      });
      canceled(port);
      const startMongo = p.spinner();
      startMongo.start("Starting MongoDB");
      execSync(
        `docker run -d --name=${name}-mongo  -e MONGO_INITDB_ROOT_USERNAME=${username} -e MONGO_INITDB_ROOT_PASSWORD=${password} -v ./data/mongo:/data/db -p ${port}:27017  mongo:6.0.5 --storageEngine=wiredTiger &>/dev/null`,
      );
      startMongo.stop("MongoDB started");
      changeEnv(
        "MONGODB_URI",
        `mongodb://${username}:${password}@localhost:27017`,
      );
    } else {
      p.outro(
        "Docker is not running. Please start Docker and try again. Exiting...",
      );
      process.exit(1);
    }
  } else {
    const username = await p.text({
      message: "What is the username for the database?",
      placeholder: "admin",
    });
    canceled(username);
    const password = await p.text({
      message: "What is the password for the database?",
      placeholder: "password",
    });
    canceled(password);
    const port = await p.text({
      message: "What port is the database running on?",
      placeholder: "27017",
    });
    canceled(port);
    changeEnv(
      "MONGODB_URI",
      `mongodb://${username}:${password}@localhost:${port}`,
    );
  }
  changeEnv("NAME", name);
  p.outro("All done! Happy coding!");
  await new Promise((resolve) => setTimeout(resolve, 2000));
}
