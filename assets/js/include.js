async function loadComponent(id, file) {
    const container = document.getElementById(id);

    if (!container) return;

    try {
        const html = await fetch(file).then(res => res.text());

        container.innerHTML = html;
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener("DOMContentLoaded", async () => {

    await loadComponent(
        "navbar-placeholder",
        "partials/navbar.html"
    );

    await loadComponent(
        "footer-placeholder",
        "partials/footer.html"
    );

});