module.exports = {
  environments: {
    test: 'test',
    ropsten: 'ropsten',
    mainnet: 'mainnet'
  },
  rpc_endpoint: {
    test: 'http://localhost:8545',
    ropsten: '< enter eth node >',
    mainnet: '< enter eth node >'
  },
  db_connection: {
    test: 'mongodb://localhost:27017/shark_data_test_db',
    ropsten: 'mongodb://localhost:27017/shark_data_test_db',
    mainnet: 'mongodb://localhost:27017/shark_data_test_db'
  },
  app_contract_address: '',
  domain: process.env.API_DOMAIN || 'http://localhost:3030',
  last_endpoint_version: '0.0.1',
  version: 'v1',
  port: 3030
}
