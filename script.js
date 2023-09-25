const newPartyForm = document.querySelector('#new-party-form');
const partyListContainer = document.querySelector('#party-list-container');
const partyContainer = document.querySelector('#party-container');

const PARTIES_API_URL =
  'http://fsa-async-await.herokuapp.com/api/workshop/parties';
const GUESTS_API_URL =
  'http://fsa-async-await.herokuapp.com/api/workshop/guests';
const RSVPS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/rsvps';
const GIFTS_API_URL = 'http://fsa-async-await.herokuapp.com/api/workshop/gifts';

// get all parties
const getAllParties = async () => {
  try {
    const response = await fetch(PARTIES_API_URL);
    // console.log(response);
    const parties = await response.json();
    return parties;
  } catch (error) {
    console.error(error);
  }
};

// get single party by id
const getPartyById = async (id) => {
  try {
    const response = await fetch(`${PARTIES_API_URL}/${id}`);
    const party = await response.json();
    return party;
  } catch (error) {
    console.error(error);
  }
};

// delete party
const deleteParty = async (id) => {
  // your code here
  // send a DELETE api call by id
  console.log('deleting ' + id);
  try {
    const requestOptions = {
      method: 'DELETE'
    }
    const response = await fetch(`${PARTIES_API_URL}/${id}`, requestOptions);
    const party = await response.json();
    return party;
  } catch (error) {
    console.error(error);
  }
};

// render a single party by id
const renderSinglePartyById = async (id) => {
  try {
    // fetch party details from server
    const party = await getPartyById(id);

    // console.log(party);

    // GET - /api/workshop/guests/party/:partyId - get guests by party id
    const guestsResponse = await fetch(`${GUESTS_API_URL}/party/${id}`);
    const guests = await guestsResponse.json();

    // GET - /api/workshop/rsvps/party/:partyId - get RSVPs by partyId
    const rsvpsResponse = await fetch(`${RSVPS_API_URL}/party/${id}`);
    const rsvps = await rsvpsResponse.json();

    // GET - get all gifts by party id - /api/workshop/parties/gifts/:partyId -BUGGY?
    // const giftsResponse = await fetch(`${PARTIES_API_URL}/party/gifts/${id}`);
    // const gifts = await giftsResponse.json();

    // create new HTML element to display party details
    const partyDetailsElement = document.createElement('div');
    partyDetailsElement.classList.add('party');
    partyDetailsElement.innerHTML = `
            <h2>${party.name}</h2>
            <p>${party.location}</p>
            <p>${party.date}</p>
            <p>${party.time}</p>
            <p>${party.description}</p>
            <h3>Guests:</h3>
            <ul>
            ${guests
        .map(
          (guest, index) => `
              <li>
                <div>${guest.name}</div>
                <div>${rsvps[index].status}</div>
              </li>
            `
        )
        .join('')}
          </ul>
          


            <button class="close-button">Close</button>
        `;

    // hide the party list container
    partyListContainer.style.display = 'none'

    // put the party details on the page ( in the container )
    partyContainer.appendChild(partyDetailsElement);

    // add event listener to close button
    const closeButton = partyDetailsElement.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
      partyDetailsElement.remove();
      partyListContainer.style.display = 'flex'
    });
  } catch (error) {
    console.error(error);
  }
};

const renderParties = async (parties) => {
  try {
    partyListContainer.innerHTML = '';
    console.log(parties); // is this an array? or is it an object? { data: players: []}
    //                                                                              ^
    // response.data.players.forEach
    // response.forEach ,<- error, because response is not an array
    parties.forEach((party) => {
      const partyElement = document.createElement('div');
      partyElement.classList.add('party');
      // partyElement.style.backgroundColor = getRandomColor()
      partyElement.innerHTML = `
                <h2>${party.name}</h2>
                <p>${party.description}</p>
                <p>${party.date}</p>
                <p>${party.time}</p>
                <p>${party.location}</p>
                <button class="details-button" data-id="${party.id}">See Details</button>
                <button class="delete-button" data-id="${party.id}">Delete</button>
            `;
      partyListContainer.appendChild(partyElement);

      // see details
      const detailsButton = partyElement.querySelector('.details-button');
      detailsButton.addEventListener('click', async (event) => {
        // get the id
        const partyId = event.target.dataset.id
        // send id to renderSinglePartyById function
        renderSinglePartyById(partyId)
      });

      // delete party
      const deleteButton = partyElement.querySelector('.delete-button');
      deleteButton.addEventListener('click', async (event) => {
        // get the id
        const partyId = event.target.dataset.id
        // pass the id to deleteParty function
        deleteParty(partyId)
        // get it off the page
        event.target.closest('div.party').remove()
      });
    });
  } catch (error) {
    console.error(error);
  }
};

// init function
const init = async () => {
  // your code here
  const parties = await getAllParties()
  // console.log(parties);
  renderParties(parties) // <- put parties in here as an argument
};

init();