import { isValidZip, showAlert } from "./validate";
import fetchJsonp from "fetch-jsonp";

const petForm = document.querySelector('#pet-form');

petForm.addEventListener('submit', fetchAnimals);

// Fetch Animals from API

function fetchAnimals(e) {
    e.preventDefault();

    //Get User Input
    const animal = document.querySelector('#animal').value;
    const zip = document.querySelector('#zip').value;

    //Validate zip
    if (!isValidZip(zip)) {
        showAlert('Please Enter A valid ZIP!', 'danger')
        return;
    }
    
    //Fetch Pets
  fetchJsonp(
          `http://api.petfinder.com/pet.find?format=json&key=1233cfd26d66daa5d0a54a8afc948beb&animal=${animal}&location=${zip}&callback=callback`, {
              jsonpCallbackFunction: 'callback'
          }
      )
      .then(res => res.json())
      .then(data => showAnimals(data.petfinder.pets.pet))
      .catch(err => console.log(err));
  }



// SHow listings of pets
function showAnimals(pets){
    const results = document.querySelector('#results');

    //Clear first
    results.innerHTML = '';
    //loop through pets

    pets.forEach(pet => {
        // console.log(pet)
        const div = document.createElement('div');
        div.classList.add('card', 'card-body', 'mb-3');
        div.innerHTML = `
            <div class='row'>
                <div class='col-sm-6'>
                    <h4>${pet.name.$t} (${pet.age.$t})</h4>
                    ${pet.breeds.breed.$t ? ` <p class='text-secondary'> ${pet.breeds.breed.$t} </p>` : `<p class='text-secondary'> Mystery </p>`}
                    ${pet.contact.address1.$t ? `<p>${pet.contact.address1.$t} ${pet.contact.city.$t} ${pet.contact.state.$t} ${pet.contact.zip.$t}</p>` : `<p>${pet.contact.city.$t} ${pet.contact.state.$t} ${pet.contact.zip.$t}</p>`}
                    <ul class='list-group'>
                        ${pet.contact.phone.$t ? `<li class='list-group-item'>Phone: ${pet.contact.phone.$t}</li>` : ``}
                        ${pet.contact.email.$t ? `<li class='list-group-item'>Email: ${pet.contact.email.$t}</li>` : ``}
                        <li class='list-group-item'>Shelter ID: ${pet.shelterId.$t}</li>
                        ${pet.description.$t ? `<li class='list-group-item'>${pet.description.$t}</li>` : `NO INFO`}
                    </ul>
                    
                </div>
                <div class='col-sm-6 text-center'>
                    ${pet.media.photos ? `<img src='${pet.media.photos.photo[3].$t} class='img-fluid rounded-circle mt-2' >` : `<h3>NO IMAGE</h3>`}
                    
                </div>
            </div>
        `;

        results.appendChild(div)
    })

}
