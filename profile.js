// ======================================
// WORKDIN - profile.js (Part 1)
// ======================================

let worker = null;
let pendingAction = null;

// Get Selected Worker ID
const selectedId = localStorage.getItem("selectedWorker");

if (!selectedId) {
    alert("No worker selected.");
    window.location.href = "index.html";
}

// ======================================
// ELEMENTS
// ======================================

const profileImage = document.getElementById("profileImage");

const workerName = document.getElementById("workerName");

const workerProfession = document.getElementById("workerProfession");

const workerAbout = document.getElementById("workerAbout");

const workerLocation = document.getElementById("workerLocation");

const workerPhone = document.getElementById("workerPhone");

const workerWhatsapp = document.getElementById("workerWhatsapp");

const workerRating = document.getElementById("workerRating");

const reviewCount = document.getElementById("reviewCount");

const jobsCompleted = document.getElementById("jobsCompleted");

const verifiedBadge = document.getElementById("verifiedBadge");

const gallery = document.getElementById("gallery");

const galleryInput = document.getElementById("galleryInput");

const reviewsContainer = document.getElementById("reviewsContainer");

const ratingInput = document.getElementById("rating");

const reviewText = document.getElementById("reviewText");

const addReview = document.getElementById("addReview");

// Rating Bars

const bar5 = document.getElementById("bar5");
const bar4 = document.getElementById("bar4");
const bar3 = document.getElementById("bar3");
const bar2 = document.getElementById("bar2");
const bar1 = document.getElementById("bar1");

// ======================================
// LOAD WORKER
// ======================================

async function loadWorker() {

    const { data, error } = await db
        .from("workers")
        .select("*")
        .eq("id", selectedId)
        .single();

    if (error || !data) {

        console.error(error);

        alert("Worker not found.");

        window.location.href = "index.html";

        return;

    }

    worker = data;

    // Prevent null errors

    if (!worker.gallery)
        worker.gallery = [];

    if (!worker.reviews)
        worker.reviews = [];

    if (!worker.rating)
        worker.rating = 0;

    if (!worker.completedjobs)
        worker.completedjobs = 0;

    loadProfile();

}

// ======================================
// LOAD PROFILE
// ======================================

function loadProfile() {

    // Profile Image

    profileImage.src =
        worker.photo && worker.photo !== ""
        ? worker.photo
        : "images/default-profile.png";

    // Name

    workerName.textContent =
        worker.name;

    // Profession

    workerProfession.textContent =
        worker.profession;

    // About

    workerAbout.textContent =
        worker.about || "No description available.";

    // Location

    workerLocation.textContent =
        worker.location;

    // Phone

    workerPhone.textContent =
        worker.phone;

    workerPhone.href =
        "tel:" + worker.phone;

    // WhatsApp

    workerWhatsapp.href =
        "https://wa.me/" + worker.whatsapp;

    // Rating

    workerRating.textContent =
        Number(worker.rating).toFixed(1);

    reviewCount.textContent =
        worker.reviews.length + " Reviews";

    // Jobs

    jobsCompleted.textContent =
        worker.completedjobs + "+";

    // Verified

    verifiedBadge.style.display =
        worker.verified
        ? "inline-flex"
        : "none";

}
// ======================================
// GALLERY
// ======================================

const imageModal = document.getElementById("imageModal");
const previewImage = document.getElementById("previewImage");
const closeImage = document.getElementById("closeImage");

// Load Gallery

function loadGallery() {

    gallery.innerHTML = "";

    if (!worker.gallery || worker.gallery.length === 0) {

        gallery.innerHTML =
            "<p>No previous work uploaded yet.</p>";

        return;

    }

    worker.gallery.forEach((image) => {

        const img = document.createElement("img");

        img.src = image;

        img.alt = "Worker Previous Work";

        img.loading = "lazy";

        img.addEventListener("click", () => {

            previewImage.src = image;

            imageModal.style.display = "flex";

        });

        gallery.appendChild(img);

    });

}

// Close Image Preview

closeImage.addEventListener("click", () => {

    imageModal.style.display = "none";

});

imageModal.addEventListener("click", (e) => {

    if (e.target === imageModal) {

        imageModal.style.display = "none";

    }

});

// ======================================
// UPLOAD GALLERY IMAGES
// ======================================

galleryInput.addEventListener("change", async function () {

    const files = [...this.files];

    if (files.length === 0) return;

    for (const file of files) {

        const reader = new FileReader();

        await new Promise((resolve) => {

            reader.onload = function (e) {

                worker.gallery.push(e.target.result);

                resolve();

            };

            reader.readAsDataURL(file);

        });

    }

    await saveGallery();

    loadGallery();

    this.value = "";

});

// ======================================
// SAVE GALLERY
// ======================================

async function saveGallery() {

    const { error } = await db

        .from("workers")

        .update({

            gallery: worker.gallery

        })

        .eq("id", worker.id);

    if (error) {

        console.error(error);

        alert("Failed to save gallery.");

        return;

    }

    console.log("Gallery Saved");

}

// ======================================
// UPDATE PROFILE
// ======================================

// At the end of loadProfile(), add these lines:
//
// loadGallery();
// loadReviews();
// updateRatingBars();
//
// So your loadProfile() should end like:
//
// verifiedBadge.style.display = worker.verified ? "inline-flex" : "none";
//
// loadGallery();
// loadReviews();
// updateRatingBars();
// ======================================
// REVIEWS
// ======================================

function loadReviews() {

    reviewsContainer.innerHTML = "";

    if (!worker.reviews || worker.reviews.length === 0) {

        reviewsContainer.innerHTML =
            "<p>No reviews yet.</p>";

        workerRating.textContent = "0.0";
        reviewCount.textContent = "0 Reviews";

        return;
    }

    worker.reviews.forEach((review) => {

        const card = document.createElement("div");

        card.className = "review";

        const initial =
            review.name
                ? review.name.charAt(0).toUpperCase()
                : "U";

        const stars = "⭐".repeat(review.rating);

        card.innerHTML = `

<div class="review-header">

<div class="review-avatar">

${initial}

</div>

<div class="review-info">

<h4>${review.name || "Anonymous"}</h4>

<p>${review.date}</p>

<div class="review-rating">

${stars}

</div>

</div>

</div>

<div class="review-comment">

${review.comment}

</div>

`;

        reviewsContainer.appendChild(card);

    });

    workerRating.textContent =
        Number(worker.rating).toFixed(1);

    reviewCount.textContent =
        worker.reviews.length + " Reviews";

}

// ======================================
// RATING BARS
// ======================================

function updateRatingBars() {

    const total = worker.reviews.length;

    if (total === 0) {

        bar5.style.width = "0%";
        bar4.style.width = "0%";
        bar3.style.width = "0%";
        bar2.style.width = "0%";
        bar1.style.width = "0%";

        return;

    }

    const count = [0, 0, 0, 0, 0];

    worker.reviews.forEach((r) => {

        count[r.rating - 1]++;

    });

    bar1.style.width = (count[0] / total) * 100 + "%";
    bar2.style.width = (count[1] / total) * 100 + "%";
    bar3.style.width = (count[2] / total) * 100 + "%";
    bar4.style.width = (count[3] / total) * 100 + "%";
    bar5.style.width = (count[4] / total) * 100 + "%";

}

// ======================================
// ADD REVIEW
// ======================================

addReview.addEventListener("click", async () => {

    const comment = reviewText.value.trim();

    const rating = Number(ratingInput.value);

    if (comment === "") {

        alert("Please write a review.");

        return;

    }

    const reviewer = prompt("Enter your name (optional)");

    worker.reviews.push({

        name: reviewer || "Anonymous",

        comment: comment,

        rating: rating,

        date: new Date().toLocaleDateString()

    });

    // Calculate Average Rating

    worker.rating =

        worker.reviews.reduce(

            (sum, review) => sum + review.rating,

            0

        ) / worker.reviews.length;

    const { error } = await db

        .from("workers")

        .update({

            reviews: worker.reviews,

            rating: worker.rating

        })

        .eq("id", worker.id);

    if (error) {

        console.error(error);

        alert("Failed to save review.");

        return;

    }

    reviewText.value = "";

    ratingInput.value = "5";

    loadReviews();

    updateRatingBars();

    alert("Review submitted successfully.");

});
// ======================================
// PASSWORD + EDIT + DELETE
// ======================================

// Password Modal Elements

const passwordModal = document.getElementById("passwordModal");
const profilePassword = document.getElementById("profilePassword");
const verifyPassword = document.getElementById("verifyPassword");
const cancelPassword = document.getElementById("cancelPassword");

// Edit Modal Elements

const editModal = document.getElementById("editModal");

const editName = document.getElementById("editName");
const editProfession = document.getElementById("editProfession");
const editPhone = document.getElementById("editPhone");
const editWhatsapp = document.getElementById("editWhatsapp");
const editLocation = document.getElementById("editLocation");
const editAbout = document.getElementById("editAbout");
const editJobsCompleted = document.getElementById("editJobsCompleted");

const saveEdit = document.getElementById("saveEdit");
const closeModal = document.getElementById("closeModal");

// Delete Modal

const deleteModal = document.getElementById("deleteModal");

const confirmDelete = document.getElementById("confirmDelete");
const cancelDelete = document.getElementById("cancelDelete");

// Buttons

const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");

// ======================================
// OPEN PASSWORD MODAL
// ======================================

editBtn.addEventListener("click", () => {

    pendingAction = "edit";

    profilePassword.value = "";

    passwordModal.style.display = "flex";

});

deleteBtn.addEventListener("click", () => {

    pendingAction = "delete";

    profilePassword.value = "";

    passwordModal.style.display = "flex";

});

// ======================================
// VERIFY PASSWORD
// ======================================

verifyPassword.addEventListener("click", () => {

    if (profilePassword.value !== worker.password) {

        alert("Incorrect Password");

        return;

    }

    passwordModal.style.display = "none";

    if (pendingAction === "edit") {

        openEditModal();

    }

    if (pendingAction === "delete") {

        deleteModal.style.display = "flex";

    }

});

cancelPassword.addEventListener("click", () => {

    passwordModal.style.display = "none";

});

// ======================================
// OPEN EDIT MODAL
// ======================================

function openEditModal() {

    editModal.style.display = "flex";

    editName.value = worker.name;

    editProfession.value = worker.profession;

    editPhone.value = worker.phone;

    editWhatsapp.value = worker.whatsapp;

    editLocation.value = worker.location;

    editAbout.value = worker.about;

    editJobsCompleted.value = worker.completedjobs;

}

// ======================================
// SAVE EDIT
// ======================================

saveEdit.addEventListener("click", async () => {

    worker.name = editName.value.trim();

    worker.profession = editProfession.value.trim();

    worker.phone = editPhone.value.trim();

    worker.whatsapp = editWhatsapp.value.trim();

    worker.location = editLocation.value.trim();

    worker.about = editAbout.value.trim();

    worker.completedjobs =
        Number(editJobsCompleted.value);

    const { error } = await db

        .from("workers")

        .update({

            name: worker.name,

            profession: worker.profession,

            phone: worker.phone,

            whatsapp: worker.whatsapp,

            location: worker.location,

            about: worker.about,

            completedjobs: worker.completedjobs

        })

        .eq("id", worker.id);

    if (error) {

        console.error(error);

        alert("Failed to save.");

        return;

    }

    editModal.style.display = "none";

    loadProfile();

    alert("Profile Updated Successfully");

});

// ======================================
// CLOSE EDIT MODAL
// ======================================

closeModal.addEventListener("click", () => {

    editModal.style.display = "none";

});

// ======================================
// DELETE PROFILE
// ======================================

confirmDelete.addEventListener("click", async () => {

    const { error } = await db

        .from("workers")

        .delete()

        .eq("id", worker.id);

    if (error) {

        console.error(error);

        alert("Delete Failed");

        return;

    }

    localStorage.removeItem("selectedWorker");

    alert("Profile Deleted");

    window.location.href = "index.html";

});

cancelDelete.addEventListener("click", () => {

    deleteModal.style.display = "none";

});

// ======================================
// CLOSE MODALS
// ======================================

window.addEventListener("click", (e) => {

    if (e.target === editModal)

        editModal.style.display = "none";

    if (e.target === passwordModal)

        passwordModal.style.display = "none";

    if (e.target === deleteModal)

        deleteModal.style.display = "none";

});

// ======================================
// START APP
// ======================================

loadWorker();
loadGallery();
loadReviews();
updateRatingBars();