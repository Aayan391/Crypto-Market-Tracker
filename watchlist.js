let watchlistTable = document.getElementById("watchlistTable");
let emptyWatchlist = document.getElementById("emptyWatchlist");

let watchlistCoins = JSON.parse(
    localStorage.getItem("watchlistCoins")
) || [];

function renderWatchlist() {

    watchlistCoins = JSON.parse(
        localStorage.getItem("watchlistCoins")
    ) || [];

    watchlistTable.innerHTML = watchlistCoins.map((coin,index) => {

        return `
        <tr class="border-b border-slate-200 dark:border-slate-700 py-2.5">
<td class="px-5 py-3">${index + 1}</td>
            
                <td class=" py-3  sticky left-0 z-30 bg-[var(--page-bg)] drak:bg-slate-900">
                <div class="flex items-center gap-3 ">   
                 <img src="${coin.image}" class="w-8 h-8" alt="">
                    <span>${coin.name}</span>
                    <span class="uppercase text-slate-500">
                        ${coin.symbol}
                    </span>
                    </div>
                </td>
        

            <td class="px-5 py-3">
                $${coin.current_price}
            </td>

            <td class="px-5 py-3 ${
                coin.price_change_percentage_24h >= 0
                ? "text-green-500"
                : "text-red-500"
            }">
                ${coin.price_change_percentage_24h ?? 0}%
            </td>

            <td class="px-5 py-3">
                $${coin.market_cap}
            </td>

            <td class="px-5 py-3">
                <button
                    class="removeCoin text-xl"
                    data-id="${coin.id}">
                    <i class="fa-solid fa-trash text-red-500"></i>
                </button>
            </td>

        </tr>
        `;

    }).join("");

    emptyWatchlist.classList.toggle(
        "hidden",
        watchlistCoins.length > 0
    );

    document.querySelectorAll(".removeCoin").forEach((button) => {

        button.addEventListener("click", () => {

            let coinId = button.dataset.id;

            watchlistCoins = watchlistCoins.filter((coin) => {
                return coin.id !== coinId;
            });

            localStorage.setItem(
                "watchlistCoins",
                JSON.stringify(watchlistCoins)
            );

            renderWatchlist();

        });

    });
}

renderWatchlist();