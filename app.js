// ===============================
// WORKDIN - app.js
// ===============================

// Load workers
let workers = [];

const workerContainer = document.getElementById("workerContainer");
const emptyTemplate = document.getElementById("emptyState");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const categoryButtons = document.querySelectorAll(".category");

async function loadWorkers() {

    const { data, error } = await db
        .from("workers")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    workers = data || [];

    displayWorkers(workers);

}

// ----------------------------
// Display Workers
// ----------------------------

function displayWorkers(workerList){

    workerContainer.innerHTML = "";

    if(workerList.length === 0){

        workerContainer.appendChild(
            emptyTemplate.content.cloneNode(true)
        );

        return;
    }

    workerList.forEach(worker=>{

        const card=document.createElement("div");

        card.className="worker-card";

        card.innerHTML=`

        <div class="verified">

            <i class="fa-solid fa-circle-check"></i>

            VERIFIED

        </div>

        <img class="worker-photo"
        src="${worker.photo || 'images/default-profile.png'}">

        <div class="worker-info">

            <div class="worker-name">

                ${worker.name}

            </div>

            <div class="profession">

                ${worker.profession}

            </div>

            <div class="location">

                <i class="fa-solid fa-location-dot"></i>

                ${worker.location}

            </div>

            <div class="rating">

                <i class="fa-solid fa-star"></i>

                ${worker.rating || "0.0"}

                <span class="review-count">

                (${worker.reviews ? worker.reviews.length : 0} Reviews)

                </span>

            </div>

            <div class="actions">

                <a
                class="call-btn"
                href="tel:${worker.phone}">

                <i class="fa-solid fa-phone"></i>

                Call

                </a>

                <a
                class="whatsapp-btn"
                target="_blank"
                href="https://wa.me/${worker.whatsapp}">

                <i class="fa-brands fa-whatsapp"></i>

                WhatsApp

                </a>

            </div>

            <button
            class="profile-btn"
            onclick="openProfile('${worker.id}')">

            <i class="fa-solid fa-user"></i>

            View Profile

            </button>

        </div>

        `;

        workerContainer.appendChild(card);

    });

}

// ----------------------------
// Search
// ----------------------------

function searchWorkers(){

    const keyword=searchInput.value
    .toLowerCase()
    .trim();

    const filtered=workers.filter(worker=>{

        return(

            worker.name.toLowerCase().includes(keyword)

            ||

            worker.profession.toLowerCase().includes(keyword)

            ||

            worker.location.toLowerCase().includes(keyword)

        );

    });

    displayWorkers(filtered);

}

searchBtn.addEventListener("click",searchWorkers);

searchInput.addEventListener("keyup",function(e){

    if(e.key==="Enter"){

        searchWorkers();

    }

});

// ----------------------------
// Category Filter
// ----------------------------

categoryButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        categoryButtons.forEach(btn=>{

            btn.classList.remove("active");

        });

        button.classList.add("active");

        const category=button.dataset.category;

        if(category==="all"){

            displayWorkers(workers);

            return;

        }

        const filtered=workers.filter(worker=>{

            return worker.profession===category;

        });

        displayWorkers(filtered);

    });

});

// ----------------------------
// Open Profile
// ----------------------------

function openProfile(id){

    localStorage.setItem("selectedWorker",id);

    window.location.href="profile.html";

}



// ----------------------------
// First Load
// ----------------------------

loadWorkers();