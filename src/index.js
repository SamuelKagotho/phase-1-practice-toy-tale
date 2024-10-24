const toggleBtn = document.querySelector('#new-toy-btn');
const toyFormContainer = document.querySelector('.container');
let isAddingToy = false;
let toyCollectionDiv = document.querySelector('#toy-collection');

const apiUrl = 'http://localhost:3000';

function fetchToys() {
  return fetch(`${apiUrl}/toys`)
    .then(response => response.json());
}

function createToy(toyData) {
  fetch(`${apiUrl}/toys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: "application/json"
      },
      body: JSON.stringify({
        "name": toyData.name.value,
        "image": toyData.image.value,
        "likes": 0
      })
    })
    .then(response => response.json())
    .then(newToy => {
      let toyElement = displayToy(newToy);
      toyCollectionDiv.append(toyElement);
    });
}

function incrementLikes(event) {
  event.preventDefault();
  let updatedLikes = parseInt(event.target.previousElementSibling.innerText) + 1;

  fetch(`${apiUrl}/toys/${event.target.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "likes": updatedLikes
      })
    })
    .then(response => response.json())
    .then(() => {
      event.target.previousElementSibling.innerText = `${updatedLikes} likes`;
    });
}

function displayToy(toy) {
  let title = document.createElement('h2');
  title.innerText = toy.name;

  let image = document.createElement('img');
  image.setAttribute('src', toy.image);
  image.setAttribute('class', 'toy-avatar');

  let likesParagraph = document.createElement('p');
  likesParagraph.innerText = `${toy.likes} likes`;

  let likeButton = document.createElement('button');
  likeButton.setAttribute('class', 'like-btn');
  likeButton.setAttribute('id', toy.id);
  likeButton.innerText = "like";
  likeButton.addEventListener('click', incrementLikes);

  let cardDiv = document.createElement('div');
  cardDiv.setAttribute('class', 'card');
  cardDiv.append(title, image, likesParagraph, likeButton);
  toyCollectionDiv.append(cardDiv);
}

toggleBtn.addEventListener('click', () => {
  isAddingToy = !isAddingToy;
  toyFormContainer.style.display = isAddingToy ? 'block' : 'none';

  if (isAddingToy) {
    toyFormContainer.addEventListener('submit', event => {
      event.preventDefault();
      createToy(event.target);
    });
  }
});

fetchToys().then(toys => {
  toys.forEach(displayToy);
});
