module.exports = {
  apps: [
    {
      name: "webhook",
      script: "bun",
      args: "run index.ts",
      // Tell PM2 to load .env file
      env_file: ".env",

      // These variables will override any duplicates from .env
      env: {
        PORT: 3005,
        NODE_ENV: "production",
      },

      // Other configurations
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "10M",
    },
  ],
};
