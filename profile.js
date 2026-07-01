// ===============================
// WORKDIN - profile.js
// ===============================

let worker = null;

const selectedId = localStorage.getItem("selectedWorker");

async function loadWorker() {

    const { data, error } = await db
        .from("workers")
        .select("*")
        .eq("id", selectedId)
        .single();

    if (error || !data) {
        alert("Worker not found.");
        window.location.href = "index.html";
        return;
    }

    worker = data;

    loadProfile();

}
// ----------------------------
// Worker Not Found
// ----------------------------




// ----------------------------
// Elements
// ----------------------------

const reviewsContainer = document.getElementById("reviewsContainer");
const ratingInput = document.getElementById("rating");
const reviewText = document.getElementById("reviewText");
const addReview = document.getElementById("addReview");

// ----------------------------
// Load Profile
// ----------------------------

function loadProfile(){

profileImage.src =
    worker.photo || "images/default-profile.png";

    workerName.textContent = worker.name;

    workerProfession.textContent = worker.profession;

    workerAbout.textContent =
        worker.about || "No description available.";

    workerLocation.textContent = worker.location;

    workerPhone.textContent = worker.phone;

    workerPhone.href = "tel:" + worker.phone;

    workerWhatsapp.href =
        "https://wa.me/" + worker.whatsapp;

    if(worker.verified){

        verifiedBadge.style.display="inline-block";

    }

    loadGallery();
console.log(worker);
console.log("Photo:", worker.photo);
    loadReviews();

}

// ----------------------------
// Gallery
// ----------------------------

function loadGallery(){

    gallery.innerHTML="";

    if(worker.gallery.length===0){

        gallery.innerHTML="<p>No work images uploaded.</p>";

        return;

    }

    worker.gallery.forEach(image=>{

        const img=document.createElement("img");

        img.src=image;

        gallery.appendChild(img);

    });

}

galleryInput.addEventListener("change",function(){

    const files=[...this.files];

    files.forEach(file=>{

        const reader=new FileReader();

        reader.onload=function(e){

            worker.gallery.push(e.target.result);

            saveWorker();

            loadGallery();

        }

        reader.readAsDataURL(file);

    });

});

// ----------------------------
// Reviews
// ----------------------------

function loadReviews(){

    reviewsContainer.innerHTML="";

    if(worker.reviews.length===0){

        reviewsContainer.innerHTML="<p>No reviews yet.</p>";

        return;

    }

    worker.reviews.forEach(review=>{

        const div=document.createElement("div");

        div.className="review";

       div.innerHTML =

"<strong>⭐ "+review.rating+"/5</strong><br><br>"+

review.comment+

"<br><small>"+review.date+"</small>";
        reviewsContainer.appendChild(div);

    });

}

addReview.addEventListener("click",async()=>{

    const review = reviewText.value.trim();

    const rating = Number(ratingInput.value);

    if(review===""){

        alert("Write a review first.");

        return;

    }


  worker.reviews.push({
    comment: review,
    rating: rating,
    date: new Date().toLocaleDateString()
});

worker.rating =
    worker.reviews.reduce((sum, r) => sum + r.rating, 0) /
    worker.reviews.length;

await saveWorker();
loadReviews();
    reviewText.value="";
    rating.value="5";
    loadReviews();

});

// ----------------------------
// Edit Profile
// ----------------------------

editBtn.addEventListener("click", () => {

    const enteredPassword = prompt("Enter your profile password");

    if (enteredPassword === null) {
        return;
    }

    if (enteredPassword !== worker.password) {
        alert("Incorrect password!");
        return;
    }

    editModal.style.display = "flex";

    editName.value = worker.name;
    editProfession.value = worker.profession;
    editPhone.value = worker.phone;
    editWhatsapp.value = worker.whatsapp;
    editLocation.value = worker.location;
    editAbout.value = worker.about;

});

// ----------------------------
// Delete Profile
// ----------------------------

deleteBtn.addEventListener("click", async () => {

    const enteredPassword = prompt("Enter your profile password");

    if (enteredPassword === null) {
        return;
    }

    if (enteredPassword !== worker.password) {
        alert("Incorrect password!");
        return;
    }

    const confirmDelete = confirm("Are you sure you want to delete this worker profile?");

    if (!confirmDelete) return;

    const { error } = await db
        .from("workers")
        .delete()
        .eq("id", worker.id);

    if (error) {
        console.error(error);
        alert("Failed to delete profile.");
        return;
    }

    localStorage.removeItem("selectedWorker");

    alert("Profile deleted successfully.");

    window.location.href = "index.html";

});
// ----------------------------
// Save
// ----------------------------

async function saveWorker() {

    const { data, error } = await db
        .from("workers")
        .update({
            name: worker.name,
            profession: worker.profession,
            phone: worker.phone,
            whatsapp: worker.whatsapp,
            location: worker.location,
            about: worker.about,
            photo: worker.photo,
            gallery: worker.gallery,
            reviews: worker.reviews,
            rating: Math.round(worker.rating)
        })
        .eq("id", worker.id)
        .select();

    console.log("UPDATED DATA:", data);
    console.log("ERROR:", error);

    if (error) {
        alert(error.message);
        return;
    }

    alert("Saved Successfully");
}
saveEdit.addEventListener("click",async()=>{

worker.name=editName.value.trim();

worker.profession=editProfession.value.trim();

worker.phone=editPhone.value.trim();

worker.whatsapp=editWhatsapp.value.trim();

worker.location=editLocation.value.trim();

worker.about=editAbout.value.trim();

await saveWorker();

loadProfile();

editModal.style.display="none";

});

closeModal.addEventListener("click",()=>{

editModal.style.display="none";

});

window.addEventListener("click",(e)=>{

if(e.target===editModal){

editModal.style.display="none";

}

});

// ----------------------------
// Start
// ----------------------------

loadWorker();
