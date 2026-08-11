
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");

    const icon = menuBtn.querySelector("i");

    icon.classList.toggle("fa-bars");
    icon.classList.toggle("fa-xmark");
});

document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("show");

        const icon = menuBtn.querySelector("i");
        icon.classList.add("fa-bars");
        icon.classList.remove("fa-xmark");
    });
});

document.getElementById("year").textContent = new Date().getFullYear();

