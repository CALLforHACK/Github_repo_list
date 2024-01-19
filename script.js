// Updated script.js
const API_URL = 'https://api.github.com/users/';
let reposPerPage = 10;
let currentPage = 1;

function fetchRepositories() {
  const username = document.getElementById('username').value;
  const repositoriesContainer = document.getElementById('repositories');
  const loader = document.getElementById('loader');
  const pagination = document.getElementById('pagination');
  const profileInfoContainer = document.querySelector('.profile-info');

  reposPerPage = parseInt(document.getElementById('reposPerPage').value, 10) || 10; // Default to 10 if no value is provided

  // Clear previous data
  repositoriesContainer.innerHTML = '';
  loader.style.display = 'block';
  pagination.innerHTML = '';
  profileInfoContainer.innerHTML = '';

  // Fetch user information and repositories
  Promise.all([
    fetch(`${API_URL}${username}`),
    fetch(`${API_URL}${username}/repos?per_page=${reposPerPage}&page=${currentPage}`)
  ])
    .then(([userResponse, reposResponse]) => Promise.all([userResponse.json(), reposResponse.json()]))
    .then(([userData, reposData]) => {
      loader.style.display = 'none';
      displayProfileInfo(userData);
      displayRepositories(reposData);

      // Add pagination controls
      const totalRepos = userData.public_repos; // Use total public repos from user data
      const totalPages = Math.ceil(totalRepos / reposPerPage);
      addPaginationControls(totalPages);
    })
    .catch(error => {
      loader.style.display = 'none';
      repositoriesContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}
function displayProfileInfo(userData) {
  const profileInfoContainer = document.querySelector('.profile-info');

  if (userData.message === 'Not Found') {
    profileInfoContainer.innerHTML = '<p>User not found.</p>';
  } else {
    const socialIconsHTML = `
      <div class="social-icons">
        <a href="${userData.html_url}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>
        <a href="${userData.blog}" target="_blank" title="Blog"><i class="fas fa-blog"></i></a>
        ${userData.twitter ? `<a href="https://twitter.com/${userData.twitter}" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a>` : ''}
        ${userData.linkedin ? `<a href="${userData.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ''}
      </div>
    `;

    profileInfoContainer.innerHTML = `
      <div class="profile-header">
        <img src="${userData.avatar_url}" alt="Profile Picture" class="profile-picture">
        ${socialIconsHTML}
      </div>
      <div class="profile-details">
        <p><strong>Name:</strong> ${userData.name || 'Not available'}</p>
        <p><strong>Username:</strong> ${userData.login}</p>
        <p><strong>Location:</strong> ${userData.location || 'Not available'}</p>
        <p><strong>Followers:</strong> ${userData.followers}</p>
        <p><strong>Following:</strong> ${userData.following}</p>
        ${userData.bio ? `<p><strong>Bio:</strong> ${userData.bio}</p>` : ''}
      </div>
    `;
  }
}



function displayRepositories(repositories) {
  const repositoriesContainer = document.getElementById('repositories');

  if (repositories.length === 0) {
    repositoriesContainer.innerHTML = '<p>No repositories found.</p>';
    return;
  }

  // Display repositories for the current page
  repositories.forEach(repo => {
    const repositoryItem = document.createElement('div');
    repositoryItem.className = 'repository';
    repositoryItem.innerHTML = `
      <h2>${repo.name}</h2>
      <p>${repo.description || 'No description available.'}</p>
      <a href="${repo.html_url}" target="_blank" class="view-repo">View Repository</a>
    `;
    repositoriesContainer.appendChild(repositoryItem);
  });
}

function addPaginationControls(totalPages) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = ''; // Clear previous pagination controls

  const paginationFooter = document.createElement('div');
  paginationFooter.className = 'pagination-footer';

  const prevPageButton = document.createElement('button');
  prevPageButton.innerText = 'Previous';
  prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      fetchRepositories();
    }
  });
  paginationFooter.appendChild(prevPageButton);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.innerText = i;
    pageButton.addEventListener('click', () => {
      currentPage = i;
      fetchRepositories();
    });
    if (i === currentPage) {
      pageButton.classList.add('active');
    }
    paginationFooter.appendChild(pageButton);
  }

  const nextPageButton = document.createElement('button');
  nextPageButton.innerText = 'Next';
  nextPageButton.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      fetchRepositories();
    }
  });
  paginationFooter.appendChild(nextPageButton);

  pagination.appendChild(paginationFooter);
}

function showData() {
  // ... (unchanged)
}

// Call showData() function on page load
window.onload = showData;
