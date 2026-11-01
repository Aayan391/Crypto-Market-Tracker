fetch("components/header.html")
.then(response=>response.text())
.then(data=>{
    document.querySelector(".header").innerHTML=data;


const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");

mobileMenuBtn?.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    mobileMenu.classList.toggle("flex");
});

mobileMenu?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("flex");
    });
});


    const lightMode=document.getElementById("lightMode")
const darkMode=document.getElementById("darkMode")



lightMode.addEventListener("click",()=>{
    document.documentElement.classList.remove("dark")
})

darkMode.addEventListener("click",()=>{
    document.documentElement.classList.add("dark")
})

const refreshbtn=document.getElementById("refreshbtn")
refreshbtn?.addEventListener("click",()=>{
    window.location.reload();
})

const SearchInput=document.getElementById("SearchInput")
SearchInput?.addEventListener("input",()=>{
const watchlistTable=document.getElementById("watchlistTable")
if(watchlistTable){
const searchText=SearchInput.value.toLowerCase();
watchlistTable.querySelectorAll("tr").forEach((row)=>{
const coinName=row.innerText.toLowerCase();
if(coinName.includes(searchText)){
row.classList.remove("hidden");

}else{
    row.classList.add("hidden")
}

})
}


})





})