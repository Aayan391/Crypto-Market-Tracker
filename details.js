

const params=new URLSearchParams(window.location.search)
const coinId=params.get("id")
const api_Key="CG-QjZ4JTQB5awqGq2nTQoJPi2G"
let watchlistCoins=JSON.parse(localStorage.getItem("watchlistCoins")) || []
let watchlistBtn=document.getElementById("watchlistBtn")
let priceChartInstance=null
let selectedDays=7


async function getCoinDetails(){

try{
const response=await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`,{

headers:{
    "x-cg-demo-api-key":api_Key
}


})
if(!response.ok){
    throw new Error(`API Error:${response.status}`);
}
const coin = await response.json();

function updateWatchListBtn(){
watchlistCoins=JSON.parse(
    localStorage.getItem("watchlistCoins") )|| [];

    const alreadySaved=watchlistCoins.some(
        (saved)=>saved.id===coin.id
    );
   if(alreadySaved){
    watchlistBtn.innerHTML = `
        <i class="fa-solid fa-star"></i>
        <span class="hidden [@media(min-width:351px)]:inline">Remove from Watchlist</span>
    `;
}else{
    watchlistBtn.innerHTML = `
        <i class="fa-regular fa-star"></i>
        <span class="hidden [@media(min-width:351px)]:inline">Add to Watchlist</span>
    `;
}

}
updateWatchListBtn();









watchlistBtn.addEventListener("click",()=>{
    watchlistCoins=JSON.parse(localStorage.getItem("watchlistCoins")) || [];
const alreadySaved=watchlistCoins.some(
  (saved)=>saved.id===coin.id  
)

if(!alreadySaved){
watchlistCoins.push({
    id:coin.id,
  market_cap_rank: coin.market_cap_rank,
    name:coin.name,
    symbol:coin.symbol,
    image:coin.image.large,
    current_price:coin.market_data.current_price.usd,
    market_cap:coin.market_data.market_cap.usd,
    price_change_percentage_24h:coin.market_data.price_change_percentage_24h

});

localStorage.setItem(
    "watchlistCoins",JSON.stringify(watchlistCoins)
)

}
window.location.href="watchlist.html"

})
document.getElementById("coinImage").src=coin.image.large;
document.getElementById("coinName").firstChild.textContent=coin.name + " ";
document.getElementById("coinSymbol").textContent=`(${coin.symbol.toUpperCase()})`
document.getElementById("coinPrice").textContent=`$${coin.market_data.current_price.usd.toLocaleString()}`;
document.getElementById("coinDescription").innerHTML= coin.description.en || "Description not available";
document.getElementById("descriptionCoinName").textContent=coin.name;
document.getElementById("marketCap").textContent=`$${coin.market_data.market_cap.usd.toLocaleString()}`
document.getElementById("volume").textContent=`$${coin.market_data.total_volume.usd.toLocaleString()}`
document.getElementById("circulatingSupply").textContent=`${coin.market_data.circulating_supply.toLocaleString()}`
document.getElementById("totalSupply").textContent=`${coin.market_data.total_supply.toLocaleString()}`
document.getElementById("high24h").textContent=`$${coin.market_data.high_24h.usd.toLocaleString()}`
document.getElementById("low24h").textContent=`$${coin.market_data.low_24h.usd.toLocaleString()}`
const website=coin.links.homepage[0];
document.getElementById("websiteLink").href=website || "#";
document.getElementById("websiteLinkBottom").href=website || "#"
const explorer=coin.links.blockchain_site[0];
document.getElementById("explorerLink").href=explorer || "#"
document.getElementById("explorerLinkBottom").href=explorer || "#"
const community=coin.links.subreddit_url;
document.getElementById("communityLink").href=community || "#"
document.getElementById("communityLinkBottom").href=community || "#"





const change=coin.market_data.price_change_percentage_24h;
document.getElementById("coinChange").textContent=`${coin.market_data.price_change_percentage_24h.toFixed(2)}%`
if(change>=0){
    document.getElementById("coinChange").style.color="green"
}else{
    document.getElementById("coinChange").style.color="red"
}

}catch(error){
    console.error("coins details not fetch",error)
}

}

async function getPriceChart(days=7){
try{
    const response=await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
{

    headers:{
         "x-cg-demo-api-key": api_Key
    }

}

    );

if(!response.ok){
    throw new Error(`chart api error:${response.status}`)
}
const data =await response.json();
const prices=data.prices;
const labels=prices.map((items)=>{
    const date =new Date(items[0]);
    return days==1
    ?date.toLocaleTimeString([],{
        hour:"2-digit",
        minute:"2-digit"
    })

    :date.toLocaleString([],{
        day:"numeric",
        month:"short"
    })
})

const priceValues=prices.map((items)=>items[1]);
const priceChart=document.getElementById("priceChart");
if(priceChartInstance){
    priceChartInstance.destroy()
}

priceChartInstance=new Chart(priceChart,{
    type:"line",
    data:{
        labels:labels,
        datasets:[{
            label:"Price(USD)",
            data:priceValues,
            borderColor:"#2563eb",
            backgroundColor:"rgba(37, 99, 235, 0.1)",
            fill:true,
            tension:0.3,
            pointRadius:0,
            borderWidth:2
        }]
    },

    options:{
        responsive:true,
        maintainAspectRatio:false,

       plugins:{
        legend:{
            display:false
        }

       } ,

       scales:{
        x:{
            ticks:{
                maxTicksLimit:7
            }
        },
        y:{
         ticks:{
            callback:(value)=> "$"+ value.toLocaleString()
         }
        }
       }


    }

})

}catch(error){
    console.error("price chart not loaded:",error)
}


}

document.querySelectorAll(".chart-range").forEach((button)=>{
    button.addEventListener("click",()=>{
    selectedDays=Number(button.dataset.days)
    document.querySelectorAll(".chart-range").forEach((btn)=>{
        btn.classList.remove("bg-blue-600","text-white")
        btn.classList.add("bg-slate-100")
    })

    button.classList.add("bg-blue-600","text-white")
    button.classList.remove("bg-slate-100")
const rangeName={
7:"7d",
30:"1M",
365:"1Y"

}

document.getElementById("chartTitle").textContent=`Price Chart (${rangeName[selectedDays]})`;
getPriceChart(selectedDays)


    })
})




getCoinDetails()
getPriceChart()