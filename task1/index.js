import neo4j from 'neo4j-driver';

const dbAuth = neo4j.auth.basic('neo4j', '36786921397');
const dbConnection = neo4j.driver('bolt://localhost:7687', dbAuth, { disableLosslessIntegers: true });

const runQuery = async (query) => {
    const session = dbConnection.session();
    const dbResult = await session.run(query);
    const result = dbResult.records[0].get(0);
    session.close();
    return result;
}

const firstBusStops = await runQuery(`
MATCH p = (begin)-[:LENGTH *0..50]-(finish)
WHERE begin.name = 'Красноармейская' AND finish.name = 'м/н Шуменский'
RETURN length(p)+1
`);

console.log(`17 bus stops count: ${firstBusStops}`);

const secondBusStops = await runQuery(`
MATCH p = (begin)-[:LENGTH *0..50]-(finish)
WHERE begin.name = '3-я Фабрика ХБК' AND finish.name = 'м/н Таврический'
RETURN length(p)+1
`);

console.log(`14 bus stops count: ${secondBusStops}`);

const thirdBusStops = await runQuery(`
MATCH p = (begin)-[:LENGTH *0..50]-(finish)
WHERE begin.name = 'Набережная' AND finish.name = 'пр. Сенявина'
RETURN length(p)+1
`);

console.log(`6 bus stops count: ${thirdBusStops}`);

dbConnection.close();