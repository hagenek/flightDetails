
const calcDist = require('./helperFunc.js').calcDist;

const airportDic  = [
{id: '97', lat: '67.57060241699219', lon: '-139.83900451660156' },
{ id: '98', lat: '54.404998779296875', lon: '-110.27899932861328' }
                                ]

const routeDic = [
    { source: '97', dest: '98' },
] 

const routesWithAirportData = 
[{
    sourceId: '246',
    source: { name: 'Ouagadougou Airport', lat: '12.3532', lon: '-1.51242' },
    destId: '247',
    dest: {
      name: 'Bobo Dioulasso Airport',
      lat: '11.160099983215332',
      lon: '-4.33096981048584'
    }
  },
  {
    sourceId: '246',
    source: { name: 'Ouagadougou Airport', lat: '12.3532', lon: '-1.51242' },
    destId: '245',
    dest: {
      name: 'Cadjehoun Airport',
      lat: '6.357230186462402',
      lon: '2.384350061416626'
    }
  }]

  const routesWithDistance = (routesWithAirport) => {
    return routesWithAirport.map((route) => {
        return {
            from: route.source.name,
            to: route.dest.name,
            distance: calcDist(+route.source.lat, +route.source.lon, +route.dest.lat, +route.dest.lon) + "km"
        }
    })
}
 

const routesWithAirport = (airportDic, routeDic) => {
    return routeDic.map((route) => {
        sourceAirport = airportDic.find((airport) => airport.id === route.source)
        destAirport = airportDic.find((airport) => airport.id === route.dest)
        return {
            sourceId : sourceAirport.id,
            source: {
                lat: sourceAirport.lat,
                lon: sourceAirport.lon
            },
            destId: destAirport.id,
            dest: {
                lat: destAirport.lat,
                lon: destAirport.lon
            }
        }
    })
}

console.log(routesWithDistance(routesWithAirportData))
