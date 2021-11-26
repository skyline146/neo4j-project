import neo4j from 'neo4j-driver';

const dbAuth = neo4j.auth.basic('neo4j', '36786921397'); // neo4j, 36786921397
const dbConnection = neo4j.driver('bolt://localhost:7687', dbAuth, { disableLosslessIntegers: true });

const runQuery = async (query) => {
    const session = dbConnection.session();
    const dbResult = await session.run(query);
    const result = dbResult.records[0].get(0);
    session.close();
    return result;
}

const runMultiQuery = async (query) => {
    const session = dbConnection.session();
    const dbResult = await session.run(query);
    const result = [];
    for (let i = 0; i < dbResult.records.length; i++) {
        result.push(dbResult.records[i].get(0));
    }
    session.close();
    return result;
}

function sumLength(arr) {
    let sum = 0;
    for (let i = 0; i < arr.segments.length; i++) {
        sum += arr.segments[i].relationship.properties.data;
    }
    return sum;
}

const runQueryParams = async (start, end) => {
    return await runQuery(`
        MATCH p = (begin)-[:LENGTH *0..50]-(finish)
        WHERE begin.name = ${start} AND finish.name = ${end}
        RETURN p
    `);
} 

const arrayBusStops = async (bus = '') => {
    return await runMultiQuery(`
        MATCH (n:Stops${bus})
        RETURN n.name
    `);
}

const firstBusStops = await runQueryParams("'Красноармейская'", "'м/н Шуменский'");
const firstBusStopsArray = await arrayBusStops();

console.log(`17 bus stops count: ${firstBusStops.length+1}, way length: ${sumLength(firstBusStops)}`);
// console.log(`Bus way: ${firstBusStopsArray.join(" --> ")}\n`);

const secondBusStops = await runQueryParams("'3-я Фабрика ХБК'", "'м/н Таврический'");
const secondBusStopsArray = await arrayBusStops('2');

console.log(`14 bus stops count: ${secondBusStops.length+1}, way length: ${sumLength(secondBusStops)}`);
// console.log(`Bus way: ${secondBusStopsArray.join(" --> ")}\n`);

const thirdBusStops = await runQueryParams("'Набережная'", "'пр. Сенявина'");
const thirdBusStopsArray = await arrayBusStops('3');

console.log(`6 bus stops count: ${thirdBusStops.length+1}, way length: ${sumLength(thirdBusStops)}`);
// console.log(`Bus way: ${thirdBusStopsArray.join(" --> ")}\n`);

dbConnection.close();