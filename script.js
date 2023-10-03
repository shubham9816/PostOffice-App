const front_page = document.getElementById("landing_page"); 
const detail_page = document.getElementById("detail_page");
const iptext = document.getElementById("ip");
const get_btn = document.getElementById("get-btn");
const ip_detail_address = document.getElementById("ip_detail_address");
const ip_detail_info = document.getElementsByClassName("ip_details")[0];
const map = document.getElementById("map");
const more_info = document.getElementById("more_info_post");
const post_office_card = document.getElementsByClassName("post_office_card")[0];
const search = document.getElementById("post_office_search");


let ipAddress = "IP Not Found";
let ipData;
let longitude;
let latitude;
let pincode;
let time_zone;
let postOfficeDetail;
// get ip function
(async () => {
    const ip = await fetch("https://ipinfo.io/?token=d7431297604d55");
    const ipDetails = await ip.json();

    // showing/hiding pages
    front_page.classList.remove("hide");
    detail_page.classList.add("hide");

    // error token is incorrect
    if (ipDetails.status == "403") {
        console.log(ipDetails.error.title);
        ipAddress = "IP Not Found";
    } else {
        ipAddress = ipDetails.ip;
    }


    iptext.innerText = ipAddress;
})();


// get start btn click
get_btn.addEventListener("click", async () => {
    if (ipAddress != "IP Not Found") {
        const fch_data = await fetch(`https://ipapi.co/${ipAddress}/json/`);
        const data = await fch_data.json();
        ipData = data;
        longitude = ipData.longitude;
        latitude = ipData.latitude;
        pincode = ipData.postal;
        time_zone = ipData.timezone;
    // showing/hiding pages
        front_page.classList.add("hide");
        detail_page.classList.remove("hide");

        // showing detail page info

        ip_detail_address.innerText = ipAddress;
        ip_detail_info.innerHTML = 
        `
            <h1 class="ip_info">Lat: <span>${latitude}</span></h1>
            <h1 class="ip_info">City: <span>${ipData.city}</span></h1>
            <h1 class="ip_info">Organisation: <span>${ipData.org}</span></h1>
            <h1 class="ip_info">Long: <span>${longitude}</span></h1>
            <h1 class="ip_info">Region: <span>${ipData.region}</span></h1>
            <h1 class="ip_info">Hostname: <span>${ipData.network}</span></h1>
        `;

        map.src = `https://maps.google.com/maps?q=${latitude}, ${longitude}&z=16&output=embed`
        
        
        const postapi = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const postOfficeData = await postapi.json();
        postOfficeDetail = postOfficeData[0];
        const time = new Date().toLocaleString("en-US", { timeZone: time_zone });

        more_info.innerHTML = `
            <h1>Time Zone: <span>${time_zone}</span></h1>
            <h1>Date And Time: <span>${time}</span></h1>
            <h1>Pincode: <span>${pincode}</span></h1>
            <h1>Message: <span>${postOfficeDetail.Message}</span></h1>
        `
        if(postOfficeDetail.Status == "Success"){
            postOfficeDetail.PostOffice.forEach(postOffice => {
                const card = document.createElement("div");
                card.className = "post_office_detail";
                card.innerHTML = `
                    <h1>${postOffice.Name}</h1>
                    <h1>${postOffice.BranchType}</h1>
                    <h1>${postOffice.DeliveryStatus}</h1>
                    <h1>${postOffice.District}</h1>
                    <h1>${postOffice.Division}</h1>
                `
                post_office_card.appendChild(card);
            });
        }
    }else{
        console.log("IP Address not Found");
    }
})

// search function
search.addEventListener("keyup", (e)=>{
    let inputText = e.target.value;
    let first = inputText[0].toUpperCase();
    let searchText= first + inputText.slice(1,inputText.length);
    if(postOfficeDetail!="undefined"){
        if(postOfficeDetail.Status == "Success"){
            postOfficeDetail.PostOffice.forEach(postOffice => {
                
                if(searchText===postOffice.Name){

                    const card = document.createElement("div");
                    card.className = "post_office_detail";
                    card.innerHTML = `
                    <h1>${postOffice.Name}</h1>
                    <h1>${postOffice.BranchType}</h1>
                    <h1>${postOffice.DeliveryStatus}</h1>
                    <h1>${postOffice.District}</h1>
                    <h1>${postOffice.Division}</h1>
                    `
                    post_office_card.appendChild(card);
                }
                });
            }
            
        }

})
