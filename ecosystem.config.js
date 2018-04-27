module.exports = {
  apps: [
    {
      name: 'POOL-SHARK-API',
      script: 'index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_staging: {
        NODE_ENV: 'ropsten',
        API_PORT: 3030,
        API_DOMAIN: 'http://localhost:3030',
        CONTRACT: '0x70e5044cE689132d8ECf6EE3433AF796F8E46575',
        RPC_ENDPOINT: '< enter rpc endpoint >',
        DB_CONNECTION: '< enter db connection >'
      }
    }
  ]
}
