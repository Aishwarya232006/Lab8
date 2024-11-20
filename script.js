const apiKey = '953273222cmsh43ceb5de3f8c7f8p1cf149jsn7333800e5e91';
const apiHost = 'alpha-vantage.p.rapidapi.com';

document.addEventListener('DOMContentLoaded', function () {
    const alertBox = document.getElementById('select-alert');
    alertBox.style.display = 'block'; 
});

document.getElementById('stock-select').addEventListener('change', function () {
    const stockSymbol = this.value;
    const stockName = this.options[this.selectedIndex].getAttribute('data-name');
    const alertBox = document.getElementById('select-alert');
    const stockInfo = document.getElementById('stock-info');
    const spinner = document.getElementById('loading-spinner');

 
    stockInfo.innerHTML = '';
    alertBox.style.display = 'none';

    if (stockSymbol) {
        spinner.style.display = 'block';  
        fetchStockData(stockSymbol, stockName);
    } else {
        alertBox.style.display = 'block';  
        spinner.style.display = 'none'; 
    }
});

async function fetchStockData(stockSymbol, stockName) {
    try {
        const response = await fetch(`https://${apiHost}/query?datatype=json&output_size=compact&interval=5min&function=TIME_SERIES_INTRADAY&symbol=${stockSymbol}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': apiHost,
                'x-rapidapi-key': apiKey
            }
        });
        const data = await response.json();
        displayStockDetails(stockSymbol, stockName, data);
    } catch (error) {
        console.error('Error fetching stock data:', error);
    } finally {
        document.getElementById('loading-spinner').style.display = 'none'; 
    }
}

function displayStockDetails(symbol, name, data) {
    const stockInfo = document.getElementById('stock-info');
    const timeSeries = data["Time Series (5min)"];
    const metaData = data["Meta Data"];
    
   
    const latestTimestamp = Object.keys(timeSeries)[0];
    const latestData = timeSeries[latestTimestamp];
    const formattedTimestamp = formatTimestamp(latestTimestamp);

    
    stockInfo.innerHTML = `
        <div class="card">
            <div class="card-body">
                <div class="stock-info-header mb-2">
                    <h5 class="card-title">${name} (${symbol})</h5>
                </div>
                <p class="card-text">Last Traded Value: <strong>$${latestData['4. close']}</strong></p>
                <p class="card-text">Volume: <strong>${latestData['5. volume']}</strong></p>
                <p class="card-text">Last Refreshed: ${formattedTimestamp}</p>
            </div>
        </div>
    `;

   
    const recentData = Object.entries(timeSeries).slice(0, 10); 
    recentData.forEach(([timestamp, stockData]) => {
        stockInfo.innerHTML += `
            <div class="card">
                <div class="card-body">
                    <h6 class="card-subtitle mb-2 text-muted">${formatTimestamp(timestamp)}</h6>
                    <div class="row">
                        <div class="col">
                            <p>Open: <strong>$${stockData['1. open']}</strong></p>
                        </div>
                        <div class="col">
                            <p>High: <strong>$${stockData['2. high']}</strong></p>
                        </div>
                        <div class="col">
                            <p>Low: <strong>$${stockData['3. low']}</strong></p>
                        </div>
                        <div class="col">
                            <p>Close: <strong>$${stockData['4. close']}</strong></p>
                        </div>
                        <div class="col">
                            <p>Volume: <strong>${stockData['5. volume']}</strong></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
}

function formatTimestamp(timestamp) {
   
    return timestamp.slice(0, -3);
}
