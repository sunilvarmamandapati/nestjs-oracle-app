module.exports = {
  apps: [
    {
      name: 'nestjs-oracle-app',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: 'logs/err.log',
      out_file: 'logs/out.log',
      log_file: 'logs/combined.log',
      time: true,
      max_memory_restart: '1G',
      restart_delay: 4000,
    },
  ],
};
