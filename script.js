const products=[
{id:1,name:"Nova X5 5G Smartphone",cat:"Mobiles",emoji:"📱",price:18999,old:24999,rating:"4.4"},
{id:2,name:"Wireless ANC Headphones",cat:"Electronics",emoji:"🎧",price:1499,old:3999,rating:"4.2"},
{id:3,name:"Running Shoes for Men",cat:"Fashion",emoji:"👟",price:999,old:2499,rating:"4.3"},
{id:4,name:"Smart LED TV 43 inch",cat:"Electronics",emoji:"📺",price:23999,old:32999,rating:"4.5"},
{id:5,name:"Cotton Bedsheet Set",cat:"Home",emoji:"🛏️",price:699,old:1299,rating:"4.1"},
{id:6,name:"Air Fryer 4.5L",cat:"Appliances",emoji:"🍳",price:2999,old:5999,rating:"4.4"},
{id:7,name:"Classic Analog Watch",cat:"Fashion",emoji:"⌚",price:1299,old:2999,rating:"4.0"},
{id:8,name:"Bluetooth Speaker",cat:"Electronics",emoji:"🔊",price:899,old:1999,rating:"4.3"},
{id:9,name:"Kitchen Storage Set",cat:"Home",emoji:"🥣",price:499,old:999,rating:"4.2"},
{id:10,name:"Gaming Laptop",cat:"Electronics",emoji:"💻",price:54999,old:69999,rating:"4.6"},
{id:11,name:"Men's Casual Shirt",cat:"Fashion",emoji:"👔",price:599,old:1199,rating:"4.1"},
{id:12,name:"Beauty Care Kit",cat:"Beauty",emoji:"💄",price:799,old:1599,rating:"4.4"},
{id:13,name:"Kids Building Blocks",cat:"Toys",emoji:"🧱",price:399,old:899,rating:"4.5"},
{id:14,name:"Electric Scooter",cat:"Two Wheelers",emoji:"🛴",price:69999,old:79999,rating:"4.2"},
{id:15,name:"Travel Backpack",cat:"Travel",emoji:"🎒",price:899,old:1799,rating:"4.3"}
];

const slides=[
{title:"Big Savings. Bigger Smiles.",text:"Top brands at amazing prices",emoji:"🛍️",cls:"s1"},
{title:"Fashion Fiesta",text:"Fresh styles from ₹299",emoji:"👗",cls:"s2"},
{title:"Tech Deals Week",text:"Mobiles, laptops & gadgets",emoji:"💻",cls:"s3"}
];

let activeCat="All", cart=[], slide=0;

const $=id=>document.getElementById(id);

function money(n){return "₹"+n.toLocaleString("en-IN")}
function discount(p){return Math.round((1-p.price/p.old)*100)}

function productCard(p){
 return `<article class="product" onclick="openProduct(${p.id})">
   <button class="wish" onclick="event.stopPropagation();this.textContent=this.textContent==='♡'?'♥':'♡'">♡</button>
   <div class="product-img">${p.emoji}</div>
   <h3>${p.name}</h3>
   <span class="rating">${p.rating} ★</span>
   <div class="price">${money(p.price)} <span class="old">${money(p.old)}</span> <span class="off">${discount(p)}% off</span></div>
 </article>`;
}

function renderProducts(){
 const q=$("searchInput").value.trim().toLowerCase();
 const list=products.filter(p=>(activeCat==="All"||p.cat===activeCat)&&(!q||p.name.toLowerCase().includes(q)||p.cat.toLowerCase().includes(q)));
 $("productGrid").innerHTML=list.map(productCard).join("");
 $("emptyState").style.display=list.length?"none":"block";
 $("dealRow").innerHTML=products.slice(0,5).map(productCard).join("");
}

function setCategory(cat){
 activeCat=cat;
 document.querySelectorAll("#categoryBar button").forEach(b=>b.classList.toggle("active",b.dataset.cat===cat));
 renderProducts();
 window.scrollTo({top:document.querySelector(".section").offsetTop-70,behavior:"smooth"});
}

function resetHome(){activeCat="All";$("searchInput").value="";renderProducts()}

document.querySelectorAll("#categoryBar button").forEach(b=>b.onclick=()=>setCategory(b.dataset.cat));
$("searchBtn").onclick=renderProducts;
$("searchInput").addEventListener("input",()=>{
 const q=$("searchInput").value.toLowerCase().trim();
 const s=$("suggestions");
 if(!q){s.style.display="none";renderProducts();return}
 const matches=products.filter(p=>p.name.toLowerCase().includes(q)).slice(0,5);
 s.innerHTML=matches.map(p=>`<div onclick="pickSuggestion('${p.name.replaceAll("'","&#39;")}')">🔎 ${p.name}</div>`).join("");
 s.style.display=matches.length?"block":"none";
 renderProducts();
});
function pickSuggestion(name){$("searchInput").value=name;$("suggestions").style.display="none";renderProducts()}

function renderSlides(){
 $("heroTrack").innerHTML=slides.map(s=>`<div class="slide ${s.cls}"><div><h1>${s.title}</h1><p>${s.text}</p><button>SHOP NOW</button></div><div class="emoji">${s.emoji}</div></div>`).join("");
 $("dots").innerHTML=slides.map((_,i)=>`<i class="${i===0?"active":""}"></i>`).join("");
 updateSlide();
}
function updateSlide(){
 $("heroTrack").style.transform=`translateX(-${slide*100}%)`;
 document.querySelectorAll(".dots i").forEach((d,i)=>d.classList.toggle("active",i===slide));
}
$("prevSlide").onclick=()=>{slide=(slide+slides.length-1)%slides.length;updateSlide()};
$("nextSlide").onclick=()=>{slide=(slide+1)%slides.length;updateSlide()};
setInterval(()=>{slide=(slide+1)%slides.length;updateSlide()},5000);

function openProduct(id){
 const p=products.find(x=>x.id===id);
 $("productDetail").innerHTML=`<div class="big-img">${p.emoji}</div><h2>${p.name}</h2><span class="rating">${p.rating} ★</span><h2>${money(p.price)} <del style="color:#888;font-size:14px">${money(p.old)}</del></h2><p>${discount(p)}% off · Free delivery available</p><button class="primary" onclick="addToCart(${p.id});closeProduct()">ADD TO CART</button>`;
 $("productModal").classList.add("show");
}
function closeProduct(){$("productModal").classList.remove("show")}

function addToCart(id){
 const found=cart.find(x=>x.id===id);
 if(found)found.qty++;else cart.push({id,qty:1});
 renderCart();
}
function renderCart(){
 $("cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0);
 if(!cart.length){$("cartItems").innerHTML='<p style="padding:30px;text-align:center;color:#777">Your cart is empty.</p>';$("cartTotal").textContent="₹0";return}
 $("cartItems").innerHTML=cart.map(x=>{
  const p=products.find(p=>p.id===x.id);
  return `<div class="cart-item"><div class="ci-img">${p.emoji}</div><div style="flex:1"><h4>${p.name}</h4><strong>${money(p.price)}</strong><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button> ${x.qty} <button onclick="changeQty(${p.id},1)">+</button></div></div></div>`;
 }).join("");
 $("cartTotal").textContent=money(cart.reduce((a,x)=>a+products.find(p=>p.id===x.id).price*x.qty,0));
}
function changeQty(id,d){
 const x=cart.find(x=>x.id===id);x.qty+=d;if(x.qty<=0)cart=cart.filter(x=>x.id!==id);renderCart();
}
function openCart(){$("cartDrawer").classList.add("open");$("overlay").classList.add("show");renderCart()}
function closeCart(){$("cartDrawer").classList.remove("open");$("overlay").classList.remove("show")}
$("cartBtn").onclick=openCart;$("overlay").onclick=closeCart;

function checkout(){
 if(!cart.length){alert("Your cart is empty.");return}
 alert("Demo checkout: connect your real payment/order backend here.");
}
$("loginBtn").onclick=()=>$("loginModal").classList.add("show");
function closeLogin(){$("loginModal").classList.remove("show")}
function login(){
 const n=$("phoneInput").value.trim();
 if(!/^\d{10}$/.test(n)){alert("Enter a valid 10-digit mobile number.");return}
 alert("Demo login successful.");
 closeLogin();
}

$("menuBtn").onclick=()=>document.querySelector(".category-bar").scrollIntoView({behavior:"smooth"});
$("moreBtn").onclick=()=>alert("More menu: Notifications, Customer Care, Advertise and Download App.");
renderSlides();renderProducts();renderCart();
