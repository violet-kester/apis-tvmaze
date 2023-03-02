"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $searchFormInput = $("#searchForm-term");
const $episodeList = $("#episodesList");

const BASE_URL = "https://api.tvmaze.com/";

// clear placeholder
$searchFormInput.val("");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(searchFormInput) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  // https://www.tvmaze.com/search/shows?q=:searchFormInput

  const response = await axios.get(
    `${BASE_URL}search/shows`,
    { params: { q: searchFormInput } }
  );

  console.log(response.data);
  //console.log(response.data[0].show.image.original);


  // change show variable
  const listOfShows = response.data.map((showAndScore) => {
    return {
      id: showAndScore.show.id,
      name: showAndScore.show.name,
      summary: showAndScore.show.summary,
      image: (showAndScore.show.image)
        ? showAndScore.show.image.original
        : "https://tinyurl.com/tv-missing",
    }
  });

  console.log(listOfShows);
  return listOfShows;

  // return [
  //   {
  //     id: 1767,
  //     name: "The Bletchley Circle",
  //     summary:
  //       `<p><b>The Bletchley Circle</b> follows the journey of four ordinary 
  //          women with extraordinary skills that helped to end World War II.</p>
  //        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their 
  //          normal lives, modestly setting aside the part they played in 
  //          producing crucial intelligence, which helped the Allies to victory 
  //          and shortened the war. When Susan discovers a hidden code behind an
  //          unsolved murder she is met by skepticism from the police. She 
  //          quickly realises she can only begin to crack the murders and bring
  //          the culprit to justice with her former friends.</p>`,
  //     image:
  //         "http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg"
  //   }
  // ]
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}"
              alt="${show.name}" 
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


// http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 * Returns list of episodes
 */

async function getEpisodesOfShow(id) {
  const response = await axios.get(`${BASE_URL}shows/${id}/episodes`);

  console.log("getEpisodesOfShow: ", response);
  const listOfEpisodes = response.data.map((episode) => {
    return {
      id: episode.id,
      name: episode.name,
      season: episode.season,
      number: episode.number,
    };
  });

  console.log("list of episodes: ", listOfEpisodes)
  return listOfEpisodes;
}


/**
 * Accepts episodes and creates and display list of episodes in the DOM
 * @param {*} episodes 
 */

// clear episode list
function populateEpisodes(episodes) {
  for (let episode of episodes) {
    const $episode = (`
      <li>${episode.name} (season ${episode.season},
        number ${episode.number})
      </li>`);

    $episodeList.append($episode);
  }

  $episodesArea.show();

}

/**
 * Our event handler and driver function. Gets the id and calls functions
 * @param {*} evt 
 * Returns nothing
 */
async function getAndShowEpisodes(evt) {
  evt.preventDefault();
  $episodeList.html("");

  // not number id, this is string id
  const id = Number($(evt.target).closest(".Show").data("show-id"));
  const episodes = await getEpisodesOfShow(id);
  populateEpisodes(episodes);
}

$showsList.on("click", ".Show-getEpisodes", getAndShowEpisodes);



// third function to get id

