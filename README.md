# Astroad

Astroad is a pre-configured setup for Astro and Payloadcms that makes it easy to get started with building your website. With Astroad, you'll have a complete development environment that you can run locally using Docker. This makes it easy to test and develop your website before deploying it to a production environment.

When you're ready to deploy the website on your own server, Astrotus comes with a production environment that requires the use of Traefik as a reverse proxy. This setup provides a secure and scalable production environment for your website.

## Getting started

To get started with Astroad, you'll need to have Docker and NPM || Yarn || PNPM installed on your machine.

1. Clone this repository: `git clone https://github.com/mooxl/astroad.git`
2. Change into the repository directory: `cd astroad`
3. Start the containers: `yarn dev`

This will start up the Astro, Payloadcms and Mongo containers and make them available on your local machine. Astro will be served at http://localhost:3000 and the Payload will be available at http://localhost:3001.

## Development

The `docker-compose.yml` and `docker-compose-dev.yml` files includes everything you need to run the containers. The containers use the environment variables declared in the `.env.dev` file and mounted volumes to store data persistently even after the containers are stopped and started.

## Deployment

Deployment is handled by a Github Actions Workflow on every push on branch `prod`. It logs into the server via SSH, pulls or clones the latest version of the repository, and runs `yarn prod`.
Because Astro is completely static, a content change in the CMS must trigger a new build of Astro. Therefore, there’s a `payload.yml` workflow that gets triggered by a webhook after every content change from Payload.

Ensure you have Traefik set up as a reverse proxy before deployment. The prod script will launch your site in a production-ready environment.

Please note that since deployment is done through Github Workflows, you need to define the necessary secrets and envs in the settings. You can find which secrets and envs are used in the `.github/workflows/push.yml` file. This file converts the existing `.env.dev` to `.env.prod` and adds the secrets and envs that have already been defined.
