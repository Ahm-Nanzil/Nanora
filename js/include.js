document.addEventListener("DOMContentLoaded", function () {



    const headerEl = document.getElementById("header");
    const footerEl = document.getElementById("footer");



    fetch("partials/header.html")
        .then(res => {
            console.log("Header fetch response:", res.status);

            if (!res.ok) {
                throw new Error("Header fetch failed with status " + res.status);
            }

            return res.text();
        })
        .then(data => {

            headerEl.innerHTML = data;
        })
        .catch(error => {
            console.error("Header load error:", error);
        });



    fetch("partials/footer.html")
        .then(res => {
            console.log("Footer fetch response:", res.status);

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