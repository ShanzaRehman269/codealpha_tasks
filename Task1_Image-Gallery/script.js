/* =========================================================
   CODEALPHA IMAGE GALLERY
   script.js
   Developed by Shanza Rehman
========================================================= */


/* =========================================================
   SELECT ELEMENTS
========================================================= */

const galleryItems = Array.from(
    document.querySelectorAll(".gallery-item")
);

const filterButtons = document.querySelectorAll(".filter-btn");

const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");

const imageCount = document.getElementById("imageCount");
const noResults = document.getElementById("noResults");

const themeToggle = document.getElementById("themeToggle");

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");

const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCategory = document.getElementById("lightboxCategory");

const imageCounter = document.getElementById("imageCounter");

const downloadBtn = document.getElementById("downloadBtn");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");


/* =========================================================
   VARIABLES
========================================================= */

let currentFilter = "all";
let currentSearch = "";
let currentImageIndex = 0;

let visibleItems = [];


/* =========================================================
   GET IMAGE INFORMATION
========================================================= */

function getImageData(item) {

    const image = item.querySelector("img");

    return {
        element: item,
        image: image,
        src: image.src,
        alt: image.alt,
        title: item.dataset.title || image.alt,
        category: item.dataset.category || "Image"
    };

}


/* =========================================================
   FILTER + SEARCH GALLERY
========================================================= */

function updateGallery() {

    currentSearch = searchInput.value.trim().toLowerCase();

    visibleItems = [];

    galleryItems.forEach(item => {

        const data = getImageData(item);

        const matchesFilter =
            currentFilter === "all" ||
            data.category.toLowerCase() === currentFilter;

        const searchText = (
            data.title + " " +
            data.category + " " +
            data.alt
        ).toLowerCase();

        const matchesSearch =
            currentSearch === "" ||
            searchText.includes(currentSearch);

        if (matchesFilter && matchesSearch) {

            item.style.display = "block";

            visibleItems.push(item);

        } else {

            item.style.display = "none";

        }

    });


    /* =========================
       UPDATE IMAGE COUNT
    ========================== */

    if (visibleItems.length === 0) {

        imageCount.textContent = "No images found";

        noResults.style.display = "block";

    } else {

        imageCount.textContent =
            `Showing ${visibleItems.length} ${
                visibleItems.length === 1 ? "image" : "images"
            }`;

        noResults.style.display = "none";

    }

}


/* =========================================================
   FILTER BUTTONS
========================================================= */

filterButtons.forEach(button => {

    button.addEventListener("click", function() {

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        updateGallery();

    });

});


/* =========================================================
   SEARCH
========================================================= */

searchInput.addEventListener("input", function() {

    updateGallery();

});


/* =========================================================
   CLEAR SEARCH
========================================================= */

clearSearch.addEventListener("click", function() {

    searchInput.value = "";

    updateGallery();

    searchInput.focus();

});


/* =========================================================
   OPEN LIGHTBOX
========================================================= */

galleryItems.forEach(item => {

    item.addEventListener("click", function() {

        /*
           Find the position of the clicked item
           inside the currently visible images.
        */

        const index = visibleItems.indexOf(item);

        if (index !== -1) {

            currentImageIndex = index;

            openLightbox();

        }

    });

});


/* =========================================================
   OPEN LIGHTBOX FUNCTION
========================================================= */

function openLightbox() {

    if (visibleItems.length === 0) {

        return;

    }

    const item = visibleItems[currentImageIndex];

    const data = getImageData(item);


    /* =========================
       IMAGE
    ========================== */

    lightboxImage.src = data.src;

    lightboxImage.alt = data.alt;


    /* =========================
       TITLE
    ========================== */

    lightboxTitle.textContent = data.title;


    /* =========================
       CATEGORY
    ========================== */

    lightboxCategory.textContent =
        capitalizeFirstLetter(data.category);


    /* =========================
       COUNTER
    ========================== */

    imageCounter.textContent =
        `${currentImageIndex + 1} / ${visibleItems.length}`;


    /* =========================
       DOWNLOAD
    ========================== */

    prepareDownload(data);


    /* =========================
       SHOW LIGHTBOX
    ========================== */

    lightbox.classList.add("active");

    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

}


/* =========================================================
   CLOSE LIGHTBOX
========================================================= */

function closeLightbox() {

    lightbox.classList.remove("active");

    lightbox.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";

}


closeBtn.addEventListener("click", closeLightbox);


/* =========================================================
   CLOSE WHEN CLICKING BACKGROUND
========================================================= */

lightbox.addEventListener("click", function(event) {

    if (event.target === lightbox) {

        closeLightbox();

    }

});


/* =========================================================
   NEXT IMAGE
========================================================= */

function showNextImage() {

    if (visibleItems.length === 0) {

        return;

    }

    currentImageIndex++;

    if (currentImageIndex >= visibleItems.length) {

        currentImageIndex = 0;

    }

    openLightbox();

}


nextBtn.addEventListener("click", showNextImage);


/* =========================================================
   PREVIOUS IMAGE
========================================================= */

function showPreviousImage() {

    if (visibleItems.length === 0) {

        return;

    }

    currentImageIndex--;

    if (currentImageIndex < 0) {

        currentImageIndex = visibleItems.length - 1;

    }

    openLightbox();

}


prevBtn.addEventListener("click", showPreviousImage);


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener("keydown", function(event) {

    if (!lightbox.classList.contains("active")) {

        return;

    }


    if (event.key === "Escape") {

        closeLightbox();

    }


    if (event.key === "ArrowRight") {

        showNextImage();

    }


    if (event.key === "ArrowLeft") {

        showPreviousImage();

    }

});


/* =========================================================
   DOWNLOAD IMAGE
========================================================= */

function prepareDownload(data) {

    /*
       Set the image URL.

       The download attribute tells the browser
       that this link should download the image.
    */

    downloadBtn.href = data.src;

    downloadBtn.download =
        createFileName(data.title);

}


/* =========================================================
   CREATE DOWNLOAD FILE NAME
========================================================= */

function createFileName(title) {

    let fileName = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    if (fileName === "") {

        fileName = "gallery-image";

    }

    return fileName + ".jpg";

}


/* =========================================================
   DOWNLOAD BUTTON CLICK
========================================================= */

downloadBtn.addEventListener("click", function(event) {

    /*
       The normal HTML download behavior is used here.

       This works for images stored locally in the
       project's images folder.
    */

    if (!downloadBtn.href || downloadBtn.href === "#") {

        event.preventDefault();

        alert("Image is not available for download.");

    }

});


/* =========================================================
   DARK / LIGHT MODE
========================================================= */

function setTheme(theme) {

    if (theme === "dark") {

        document.body.classList.add("dark");

        themeToggle.textContent = "☀️ Light Mode";

    } else {

        document.body.classList.remove("dark");

        themeToggle.textContent = "🌙 Dark Mode";

    }

}


/* =========================================================
   THEME BUTTON
========================================================= */

themeToggle.addEventListener("click", function() {

    const isDark =
        document.body.classList.contains("dark");

    if (isDark) {

        setTheme("light");

        localStorage.setItem("galleryTheme", "light");

    } else {

        setTheme("dark");

        localStorage.setItem("galleryTheme", "dark");

    }

});


/* =========================================================
   LOAD SAVED THEME
========================================================= */

const savedTheme =
    localStorage.getItem("galleryTheme");

if (savedTheme === "dark") {

    setTheme("dark");

} else {

    setTheme("light");

}


/* =========================================================
   CAPITALIZE CATEGORY
========================================================= */

function capitalizeFirstLetter(text) {

    if (!text) {

        return "";

    }

    return text.charAt(0).toUpperCase() + text.slice(1);

}


/* =========================================================
   IMAGE LOADING
========================================================= */

galleryItems.forEach(item => {

    const image = item.querySelector("img");

    image.addEventListener("load", function() {

        image.classList.add("loaded");

    });

});


/* =========================================================
   IMAGE ERROR HANDLING
========================================================= */

galleryItems.forEach(item => {

    const image = item.querySelector("img");

    image.addEventListener("error", function() {

        console.warn(
            "Unable to load image:",
            image.src
        );

    });

});


/* =========================================================
   INITIAL GALLERY LOAD
========================================================= */

updateGallery();


/* =========================================================
   PREVENT LIGHTBOX IMAGE DRAGGING
========================================================= */

lightboxImage.addEventListener("dragstart", function(event) {

    event.preventDefault();

});


/* =========================================================
   TOUCH / SWIPE SUPPORT
========================================================= */

let touchStartX = 0;
let touchEndX = 0;


lightbox.addEventListener("touchstart", function(event) {

    touchStartX = event.changedTouches[0].screenX;

});


lightbox.addEventListener("touchend", function(event) {

    touchEndX = event.changedTouches[0].screenX;

    handleSwipe();

});


function handleSwipe() {

    const difference = touchStartX - touchEndX;

    /*
       Swipe left
    */

    if (difference > 50) {

        showNextImage();

    }

    /*
       Swipe right
    */

    if (difference < -50) {

        showPreviousImage();

    }

}


/* =========================================================
   PAGE VISIBILITY
========================================================= */

document.addEventListener("visibilitychange", function() {

    if (document.hidden && lightbox.classList.contains("active")) {

        closeLightbox();

    }

});


/* =========================================================
   FINAL INITIALIZATION
========================================================= */

console.log(
    "CodeAlpha Image Gallery loaded successfully."
);