fetchData()

async function fetchData(id, timePeriod) {
    const url = 'https://coinranking1.p.rapidapi.com/coin/Qwsogvtv82FCd/history?referenceCurrencyUuid=yhjMzLPhuIDl&timePeriod=5y';
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'd2f437d3ffmsh2d6fc063ae7a7fbp1b1a83jsn708210271d98',
            'X-RapidAPI-Host': 'coinranking1.p.rapidapi.com'
        }
    };
    
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}