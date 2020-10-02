const axios = require('axios');
const parse = require('csv-parse/lib/sync');
const calcDist = require('./helperFunc').calcDist


const routeArrayToObject =  (array) => {
    return {
        source: array[3],
        dest: array[5]
    }
}

const cleanRoutesArray = (array) => {
   return array.filter((obj) => (obj.from !== undefined || obj.to !== undefined))
}

const routesWithDistance = (routesWithAirport) => {
    return routesWithAirport.map((route) => {
        if (route.sourceId === '9999' || route.destId === '9999') return {}; 
        return {
            from: route.source.name,
            to: route.dest.name,
            distance:  calcDist(+route.source.lat, +route.source.lon, +route.dest.lat, +route.dest.lon)
        }
    })
}

const sortListByDistance = (routesWithDistanceData) => {
    return routesWithDistanceData.sort((a, b) => parseFloat(+b.distance) - parseFloat(+a.distance));
}

const airportArrayToObject = (array) => {
    return {
        id: array[0],
        name: array[1],
        lat: array[6],
        lon: array[7]
    }
}
 
const routesWithAirport = (airportDic, routeDic) => {
    return routeDic.map((route) => {
        let sourceAirport = airportDic.find((airport) => airport.id === route.source)
        if (!sourceAirport) sourceAirport = {id: '9999', name: 'Not found', lat: '1', lon: '1' };
        let destAirport = airportDic.find((airport) => airport.id === route.dest)
        if (!destAirport) destAirport = {id: '9999', name: 'Not found', lat: '1', lon: '1' };
        return {
            sourceId : sourceAirport.id,
            source: {
                name: sourceAirport.name,
                lat: sourceAirport.lat,
                lon: sourceAirport.lon
            },
            destId: destAirport.id,
            dest: {
                name: destAirport.name,
                lat: destAirport.lat,
                lon: destAirport.lon
            }
        }
    })
}

const removeDuplicates = (route) => {
return route.slice(0, 100)
    .filter((route, index, self) => index === self
    .findIndex((t) => (t.distance === route.distance)))
}


async function getRouteDataWithAirports() {
    // fetch data from a url endpoint
    const response = await axios.get('https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat')
    const parsedResult = await parse(response.data)
    const objectifiedAirportResult = parsedResult.map((a) => airportArrayToObject(a));
    const routeDictionary = await getRouteData();
    const routesWithAirportData = routesWithAirport(objectifiedAirportResult, routeDictionary);
    const routesWithAirportDataAndDistance = routesWithDistance(routesWithAirportData);
    const routesWithAllDataCleaned = cleanRoutesArray(routesWithAirportDataAndDistance);
    const sortedListByDistance = sortListByDistance(routesWithAllDataCleaned);
    const listWithoutDuplicates = removeDuplicates(sortedListByDistance);
    console.log(listWithoutDuplicates)
  }

  async function getRouteData() {
    let data = await axios.get('https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat')
    data = parse(data.data).map((array) => routeArrayToObject(array));
    return data
  }

getRouteDataWithAirports();

/* printData(getRouteDataWithAirports);
printData(getRouteData); */

