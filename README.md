# Shark of The Pool - API
Backend API - Shark of The Pool

Service is designed to parse events for contract specified in the ./config/main.
It will parse events from ./config/contract_included_block, and automatically
add other contracts, created by the main contract.

It parses events every 30s for each contract stored in the contracts table.

#### Running service
Make sure you specify correct RPC provider, contract address and db connection.
You need to run MongoDb database.

Run: 
```
$ npm start
```

#### Run with docker
Make sure you set all the environment variables in the ecosystem.config.js

Running container:
```
$ docker-compose up -d --build
```
