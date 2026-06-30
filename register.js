// ===============================
// WORKDIN - register.js
// ===============================

const form = document.getElementById("workerForm");

const imageInput = document.getElementById("image");
const previewImage = document.getElementById("previewImage");

let profileImage = "";

// ---------------------------
// Image Preview
// ---------------------------

imageInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        profileImage = e.target.result;

        previewImage.src = profileImage;

    };

    reader.readAsDataURL(file);

});

// ---------------------------
// Register Worker
// ---------------------------

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const profession = document.getElementById("profession").value;
    const phone = document.getElementById("phone").value.trim();
    const whatsapp = document.getElementById("whatsapp").value.trim();
    const location = document.getElementById("location").value.trim();
    const about = document.getElementById("about").value.trim();

    if (!name || !profession || !phone || !whatsapp || !location) {
        alert("Please fill all required fields.");
        return;
    }

    if (phone.length !== 10 || isNaN(phone)) {
        alert("Enter a valid mobile number.");
        return;
    }

    if (whatsapp.length !== 10 || isNaN(whatsapp)) {
        alert("Enter a valid WhatsApp number.");
        return;
    }

    // Check duplicate worker
    const { data: existingWorkers, error: checkError } = await db
        .from("workers")
        .select("*")
        .or(`phone.eq.${phone},and(name.eq.${name},profession.eq.${profession})`);

    if (checkError) {
        alert("Error checking existing worker.");
        console.error(checkError);
        return;
    }

    if (existingWorkers.length > 0) {
        alert("This worker is already registered.");
        return;
    }

    // Save worker
    const { error } = await db
    .from("workers")
        .insert([{
            name,
            profession,
            phone,
            whatsapp,
            location,
            about,
            photo: profileImage,
            gallery: [],
            rating: 0,
            reviews: [],
            verified: false,
            createdat: new Date().toISOString()
        }]);

    if (error) {
        console.error(error);
        alert("Registration failed.");
        return;
    }

    alert("Registration Successful!");

    form.reset();
    previewImage.src = "images/default-profile.png";
    profileImage = "";

    window.location.href = "index.html";

});