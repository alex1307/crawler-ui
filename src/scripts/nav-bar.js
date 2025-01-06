document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarTitle = document.getElementById('navbar-title');

    // Check if there's a stored title and display it
    const storedTitle = localStorage.getItem('navbarTitle');
    if (storedTitle) {
        navbarTitle.textContent = storedTitle;
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            const title = this.getAttribute('data-title');
            console.log("Title Found:", title);

            if (title) {
                navbarTitle.textContent = title;
                // Store the title in localStorage
                localStorage.setItem('navbarTitle', title);
            }
        });
    });
});