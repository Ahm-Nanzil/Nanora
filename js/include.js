document.addEventListener("DOMContentLoaded", function () {

    const headerEl = document.getElementById("header");
    const footerEl = document.getElementById("footer");

    fetch("partials/header.html")
        .then(res => {
            if (!res.ok) {
                throw new Error("Header fetch failed with status " + res.status);
            }
            return res.text();
        })
        .then(data => {
            headerEl.innerHTML = data;

            // ✅ Call here AFTER header loads
            setActiveNav();
        })
        .catch(error => {
            console.error("Header load error:", error);
        });


    fetch("partials/footer.html")
        .then(res => {
            if (!res.ok) {
                throw new Error("Footer fetch failed with status " + res.status);
            }
            return res.text();
        })
        .then(data => {
            footerEl.innerHTML = data;
        })
        .catch(error => {
            console.error("Footer load error:", error);
        });

});

function setActiveNav() {

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".navbar-nav .nav-link").forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }

    });

}