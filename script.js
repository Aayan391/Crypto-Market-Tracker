let CryptoTable=document.getElementById("CryptoTable")
let sort=document.getElementById("Sort")
let filter=document.getElementById("filter")
let currentPage=1;
let coinsPerPage=10;
let allcoins=[];
let filteredCoins=[];
let watchlistCoins=JSON.parse(localStorage.getItem("watchlistCoins")) || [];
function updateWatchList(){
    watchlistCoins=JSON.parse(localStorage.getItem("watchlistCoins")) || [];
}

const lightMode=document.getElementById("lightMode")
const darkMode=document.getElementById("darkMode")



lightMode.addEventListener("click",()=>{
    document.documentElement.classList.remove("dark")
})

darkMode.addEventListener("click",()=>{
    document.documentElement.classList.add("dark")
})


const api_Key="CG-QjZ4JTQB5awqGq2nTQoJPi2G"
const api_Url= "https://api.coingecko.com/api/v3/coins/markets" +
    "?vs_currency=usd" +
    "&order=market_cap_desc" +
    "&per_page=20" +
    "&page=1" +
    "&sparkline=false";


async function getCryptoData(){
  document.getElementById("loading").classList.remove("hidden")
  document.getElementById("error").classList.add("hidden")
  document.getElementById("empty").classList.add("hidden")

try{
    const response = await fetch(api_Url,{
        headers:{
             "x-cg-demo-api-key":api_Key
        }
    })
if(!response.ok){
    throw new Error(`API Error:${response.status}`)
}

 allcoins=await response.json();
 console.log(allcoins);
 
 document.getElementById("loading").classList.add("hidden")

 

function renderCoins(){
let SearchInput=document.getElementById("SearchInput").value.toLowerCase();
 filteredCoins=allcoins.filter((coin)=>{
    return coin.name.toLowerCase().includes(SearchInput)||
    coin.symbol.toLowerCase().includes(SearchInput)
    

});

let gainers=filter.value;
if(gainers==="gainers"){
filteredCoins=filteredCoins.filter((coin)=>{
    return coin.price_change_percentage_24h>0
})
}else if(gainers==="losers"){
    filteredCoins=filteredCoins.filter((coin)=>{
        return coin.price_change_percentage_24h<0
    })
}else if(gainers==="stablecoins"){
    let stableCoins=["usdt","usdc","usds"]
    filteredCoins=filteredCoins.filter((coin)=>{
        return stableCoins.includes((coin.symbol.toLowerCase()))
    })
}





let highSort=sort.value;
if(highSort==="price_high"){
    filteredCoins.sort((a,b)=>{
      return  b.current_price-a.current_price;
    })
}

let lowSort=sort.value;
if(lowSort==="price_low"){
    filteredCoins.sort((a,b)=>{
        return a.current_price-b.current_price;
    })
}

let changeHigh=sort.value;
if(changeHigh==="change_high"){
    filteredCoins.sort((a,b)=>{
        return b.price_change_percentage_24h-a.price_change_percentage_24h;
    })
}

let nameSort=sort.value;
if(nameSort==="name"){
    filteredCoins.sort((a,b)=>{
        return a.name.localeCompare(b.name)
    })
}

let marketCap=sort.value;
if(marketCap==="market_cap"){
    filteredCoins.sort((a,b)=>{
        return b.market_cap-a.market_cap;
    })
}

let start=(currentPage-1)*coinsPerPage;
let end=start+coinsPerPage;
let visibleCoins=filteredCoins.slice(start,end)


CryptoTable.innerHTML=visibleCoins.map((coin)=>{

    
return ` <tr>
             <td class="px-5 py-3">${coin.market_cap_rank??"-"}</td>
             <td class="flex items-center py-3 gap-3 sticky left-0 z-30 bg-[var(--page-bg)]"> 
             <a href="details.html?id=${coin.id}" class="flex items-center gap-3">
                <img src="${coin.image}" alt="" class="w-8 h-8 rounded-[20px]">
                <span>${coin.name}</span>
                <span class="uppercase">${coin.symbol}</span>
                </a>
             </td>
             <td class="px-5 py-3">$${coin.current_price}</td>
             <td class="px-5 py-3 ${
    coin.price_change_percentage_24h < 0
    ? "text-red-500"
    : coin.price_change_percentage_24h > 0
    ? "text-green-500"
    : ""
}">
    ${coin.price_change_percentage_24h}%
</td>
             <td class="px-5 py-3">$${coin.market_cap}T</td>
             <td class="px-5 py-3">${coin.high_24h}B</td>
             <td class="px-5 py-3 text-2xl text-amber-400"><Button class="watchlistbtn" data-id="${coin.id}" >
             ${watchlistCoins.some((saved)=> saved.id===coin.id)?"★":"☆"}
             </Button></td>
            </tr>
            `




}).join("")

document.querySelectorAll(".watchlistbtn").forEach((button)=>{
    button.addEventListener("click",()=>{
updateWatchList();

        let coinId=button.dataset.id;
        let selectedCoin=allcoins.find((coin)=>{
            return coin.id===coinId;
        })

      let alreadySaved=watchlistCoins.some((coin)=>{
        return coin.id===coinId;
      })

      if(!alreadySaved && selectedCoin){
        watchlistCoins.push(selectedCoin);

    localStorage.setItem(
"watchlistCoins",
JSON.stringify(watchlistCoins)

    );
    button.innerText="★";

      }
        
    })
})

if(visibleCoins.length===0){
  document.getElementById("empty").classList.remove("hidden")

}else{
    document.getElementById("empty").classList.add("hidden")
}




let pageInfo=document.getElementById("pageInfo")
let showingFrom=filteredCoins.length===0 ? 0:start+1;
let showingTo=Math.min(end,filteredCoins.length)
pageInfo.innerText=`Showing ${showingFrom}-${showingTo} of ${filteredCoins.length} coins`
document.getElementById("page1").classList.toggle(
    "bg-blue-600",currentPage===1
)

document.getElementById("page1").classList.toggle(
    "text-white",currentPage===1
)

document.getElementById("page2").classList.toggle(
    "bg-blue-600",currentPage===2
)

document.getElementById("page2").classList.toggle(
    "text-white",currentPage===2
)

}
renderCoins();

filter.addEventListener("change",()=>{
    currentPage=1;
    renderCoins();
})

sort.addEventListener("change",()=>{
    currentPage=1;
    renderCoins();
})

document.getElementById("SearchInput").addEventListener("input",()=>{
    currentPage=1;
    renderCoins();
})

document.getElementById("page1").addEventListener("click",()=>{
    if(currentPage>1){
        currentPage=1
        renderCoins();
    }
})

document.getElementById("page2").addEventListener("click",()=>{
    let totalPages=Math.ceil(filteredCoins.length/coinsPerPage)
    if(currentPage<totalPages){
        currentPage=2
        renderCoins();
    }
})

document.getElementById("prevPage").addEventListener("click",()=>{
    if(currentPage>1){
        currentPage--;
        renderCoins();
    }
})

document.getElementById("nextPage").addEventListener("click",()=>{
    let totalPages=Math.ceil(filteredCoins.length/coinsPerPage)
    if(currentPage<totalPages){
        currentPage++;
        renderCoins();
    }
})




}

catch(error){
 document.getElementById("loading").classList.add("hidden")
 document.getElementById("error").classList.remove("hidden")
    
}

}

document.getElementById("retrybtn").addEventListener("click",()=>{
     getCryptoData()

})


document.getElementById("refreshbtn").addEventListener("click",()=>{
document.getElementById("filter").value="all"
document.getElementById("Sort").value="market_cap"
document.getElementById("SearchInput").value=""
currentPage=1;
updateWatchList();
    getCryptoData()

})

 getCryptoData()

