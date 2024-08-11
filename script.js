document.addEventListener('DOMContentLoaded', function() {
    // Fade in the page content on load
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
        
        // Fade out the logo
        const fadeImageContainer = document.getElementById('fadeImageContainer');
        if (fadeImageContainer) {
            fadeImageContainer.style.opacity = '1';
            fadeImageContainer.style.transition = 'opacity 3s';
            setTimeout(() => {
                fadeImageContainer.style.opacity = '0';
            }, 100);
        }
    });

    // Form submission and IP fetching
    const detailsForm = document.getElementById('detailsForm');
    if (detailsForm) {
        detailsForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const message = document.getElementById('message').value;
            const date = new Date().toLocaleString();
            const referrer = 'instagram'; // Set a fixed referrer name for this page

            fetch('https://ipinfo.io?token=aaad8e9b2f8309')
                .then(response => response.json())
                .then(data => {
                    const ip = data.ip;
                    const country = data.country;
                    const state = data.region;

                    return fetch(`https://restcountries.com/v3.1/alpha/${country}`)
                        .then(response => response.json())
                        .then(countryData => {
                            const phoneCode = countryData[0].idd.root + countryData[0].idd.suffixes[0];

                            const details = JSON.parse(localStorage.getItem('details')) || [];
                            details.push({
                                username,
                                message,
                                ip,
                                country: countryData[0].name.common,
                                state,
                                phoneCode,
                                date,
                                referrer
                            });
                            localStorage.setItem('details', JSON.stringify(details));

                            // Redirect to success.html
                            window.location.href = 'success.html';
                        });
                })
                .catch(error => {
                    console.error('Error fetching IP or country information:', error);
                });
        });
    }

    // Login/Logout and Section Display Management
    const loginForm = document.getElementById('loginForm');
    const loginSection = document.getElementById('loginSection');
    const mainSection = document.getElementById('mainSection');
    const logoutButton = document.getElementById('logoutButton');

    function showMainSection() {
        loginSection.style.display = 'none';
        mainSection.style.display = 'block';
    }

    function showLoginSection() {
        loginSection.style.display = 'block';
        mainSection.style.display = 'none';
    }

    function checkLoginStatus() {
        const loggedIn = localStorage.getItem('loggedIn') === 'true';
        if (loggedIn) {
            showMainSection();
        } else {
            showLoginSection();
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            // Simple hardcoded authentication for demonstration
            if (username === 'user' && password === 'password') {
                localStorage.setItem('loggedIn', 'true');
                showMainSection();
            } else {
                alert('Invalid credentials');
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('loggedIn');
            showLoginSection();
        });
    }

    checkLoginStatus();

    // Handling table data
    const details = JSON.parse(localStorage.getItem('details')) || [];
    const tableBody = document.querySelector('#detailsTable tbody');

    if (tableBody) {
        // Function to create a new row
        function createRow(detail, index) {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = index + 1;
            row.appendChild(idCell);

            const referrerCell = document.createElement('td');
            referrerCell.textContent = detail.referrer;
            row.appendChild(referrerCell);

            const usernameCell = document.createElement('td');
            usernameCell.textContent = detail.username;
            row.appendChild(usernameCell);

            const messageCell = document.createElement('td');
            messageCell.textContent = detail.message;
            row.appendChild(messageCell);

            const ipCell = document.createElement('td');
            ipCell.textContent = detail.ip;
            row.appendChild(ipCell);

            const countryCell = document.createElement('td');
            countryCell.textContent = detail.country;
            row.appendChild(countryCell);

            const stateCell = document.createElement('td');
            stateCell.textContent = detail.state;
            row.appendChild(stateCell);

            const phoneCodeCell = document.createElement('td');
            phoneCodeCell.textContent = detail.phoneCode;
            row.appendChild(phoneCodeCell);

            const dateCell = document.createElement('td');
            dateCell.textContent = detail.date;
            row.appendChild(dateCell);

            // Create delete button at the end of the row
            const actionCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete';
            deleteButton.addEventListener('click', function() {
                deleteDetail(index);
            });
            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);

            return row;
        }

        // Add each detail entry to the table
        details.forEach((detail, index) => {
            const row = createRow(detail, index);
            tableBody.insertBefore(row, tableBody.firstChild); // Insert new rows at the top
        });

        // Function to delete an individual detail
        function deleteDetail(index) {
            const details = JSON.parse(localStorage.getItem('details')) || [];
            details.splice(index, 1);
            localStorage.setItem('details', JSON.stringify(details));
            location.reload(); // Reload the page to reflect changes
        }

        // Function to delete all details
        document.getElementById('clearAll').addEventListener('click', function() {
            localStorage.removeItem('details');
            location.reload(); // Reload the page to reflect changes
        });
    }
});
