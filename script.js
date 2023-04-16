//API used to get list of movies ->  `http://www.omdbapi.com/?s=thor&page=1&apikey=51bfef74

// Function to handle all the activities on main Page
    function mainApp(){
        let search="";
        const MOVIE_NOT_FOUND = "Movie not found!";
        let searchResultsArray =[];
        let API ="";
        const popularList = `https://www.omdbapi.com/?s=Avengers&plot=full&apikey=51bfef74`;
        //`http://www.omdbapi.com/?s=Avengers&plot=full&page=1&apikey=51bfef74`;
        let searchInput = document.getElementById("search-div");
        let movieContainer = document.getElementById("movies-container");
        const favLists = document.getElementById('list');
        const emptyFavMessage = document.getElementById('Empty-Fav-Message');

        // renderList -> This function renders a list of movies fetched from API on home screen
        function renderList(moviesList){
            let elementList=[];
            
            for(let i=0;i<moviesList.length;i++){
                let element=renderMovie(moviesList[i]);
                elementList.push(element); 
                movieContainer.append(element);
            }
            
        }
        // renderMovie -> creates HTML for a movie
        function renderMovie(movie){
            const element = document.createElement("div");
            element.innerHTML=`<div class="movies">            
            <div class="movie-poster">
            <img src=${movie['Poster']} onerror="this.onerror=null;this.src='https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg';">
        </div>
            <div class="movie-info">                
                <div class="add-To-Fav-container">                
                   ${checkMovieAddedtoFavList(movie['imdbID'])}
                </div>
                <div class="title-container">
                <a class="disableTextDecoration movieId" data-href="#" onclick='mainApp().navigateToAdditionalInfoPage(this.dataset.id)' data-id="${movie['imdbID']}">
                <div class="svg-img-container">
                <img class="svg-img" src="Assets/icons8-star-filled-48.png" alt="">
                </div> 
                <div  title="${movie['Title']}" class="white-color movie-Title">
                ${movie['Title']}
                </div>
                </a>
                </div>               
            </div>
        </div>`

        return element;
        }
        // check whether movie is added to Fav list
        function checkMovieAddedtoFavList(imdbId){
            let flag = localStorage.getItem(imdbId);
            if(flag==null){
                return `<button data-id=${imdbId} class="add-To-Fav">+</button>`;
            }else{
                return `<div class="added-To-Fav"><i class="fa-solid fa-check"></i></div>`;
            }
        }

        function emptyFavListMessage(){
            if(localStorage.length==0){
                emptyFavMessage.classList.remove("none-display");
            }else{
                console.log("tried to remove mssge ")
                emptyFavMessage.classList.add("none-display");
            }

        }
        // renderFavourites -> this function renders list of movies added to local storage in the form of HTML on page
        function renderFavourites(){
            favLists.innerHTML="";
            for (let x=0;x<localStorage.length;x++){
                    const jsonObj = parseLocalStorage(localStorage.key(x));
                    if(jsonObj!=null){
                        const li = document.createElement('li');
                        li.innerHTML = `<li>
                                        <div class="fav-list-Item">
                                            <div class="fav-Poster-Container">
                                            <img class="fav-Poster" src=${jsonObj['Poster']} onerror="this.onerror=null;this.src='https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg';" alt="">
                                            </div>                                            
                                            <span>                                                
                                                <a class="disableTextDecoration movieId" href="#" onclick='mainApp().navigateToAdditionalInfoPage(this.dataset.id)' data-id="${jsonObj['imdbID']}">
                                                <p class="white-color fav-Title">${jsonObj['Title']}</p>
                                                </a>
                                                <p class="gray-color">${jsonObj['Year']}</p>
                                                <img src="assets/delete-button-svgrepo-com.svg" class="delete" data-id="${jsonObj['imdbID']}"/>
                                            </span>                                    
                                        </div>
                                    </li>`                        
                        favLists.append(li);                        
                    }                    
            }
        }
        // addMovieToFavourite -> function to add movie to list of favourites and render the fav lists
        function addMovieToFavourite(movieId){
            const findMovie = window.localStorage.getItem(movieId);
            if(findMovie!=null){
                    return;
            }
            const myFavMovie = searchResultsArray.filter((movie)=>{
                    return movie['imdbID']==movieId;
                })                
                addToFav(myFavMovie[0]);
                emptyFavListMessage();
                renderFavourites();
                movieContainer.innerHTML='';
                renderList(searchResultsArray);
        }
        
        function addToFav(favMovie){
                const id=favMovie['imdbID'];
                const stringifyMovie = JSON.stringify(favMovie);
                localStorage.setItem(id,stringifyMovie);
        }
        // function to parse localStorage objects to JSON Form
        function parseLocalStorage(id){
            const item = window.localStorage.getItem(id);
            let jsonObj='';
            if(item!=null){
            jsonObj = JSON.parse(item);
            return jsonObj;
            }else{
            return null;
            }    
        }
        // Remove movie from fav list
        function removeMovieFromFavourites(id){
            localStorage.removeItem(id);
            renderFavourites();
            emptyFavListMessage();
            movieContainer.innerHTML='';
            renderList(searchResultsArray);
        }

        // Functions to handle inputs
        function handleInput(event){
            if(event.target.id=="search-box"){
                let input=event.target.value;
                let key=input.replace(" ","+");
                search=key;
                if(search.length>=3){
                    API = `https://www.omdbapi.com/?s=${search}&page=1&apikey=51bfef74`;   
                    fetchMovies(API);
                }
                
            }

        }
        function handleClick(event){
            if(event.target.className==="add-To-Fav"){
                const movieId = event.target.dataset.id;
                addMovieToFavourite(movieId);
            }
            else if(event.target.className==="delete"){
                const imdbID = event.target.dataset.id;
                console.log("Remove Triggered", imdbID);
                removeMovieFromFavourites(imdbID);
            }
            else if(event.target.className==="movieId"){
                window.alert('clicked');
                const movieId = event.target.dataset.id;
            }
        }
        // Function to call  API for searched keyword
        async function fetchMovies(API){
            try{
                let response=await fetch(API);
                let data=await response.json();        
                if(data['Response']=='True'){
                    searchResultsArray = data['Search'];
                    movieContainer.innerHTML='';
                    renderList(searchResultsArray);
                    console.log(searchResultsArray);
                }else{
                    console.log(data['Error']);
                }       
                
            }catch(error){
                console.log("error while fetching movies from omdb api: ",error);
            }

        }

        async function navigateToAdditionalInfoPage(id){            
            // let request = `http://www.omdbapi.com/?i=${id}&plot=full&apikey=51bfef74`
            // let response = await fetch(request);
            // let data = await response.json();
            // let stringifyData = JSON.stringify(data);
            // sessionStorage.setItem("imdBID",id); 
            // location.assign("additionalMovieInfo.html"); 
            let url = encodeURI(`additionalMovieInfo.html?${id}`);
            location.assign(url);
                              
        }
        // Initialization
        function initializeApp(){
            fetchMovies(popularList);
            renderFavourites();
            emptyFavListMessage();
            document.addEventListener('keyup',handleInput);
            document.addEventListener('click',handleClick);
        }

        return {
            initializeApp : initializeApp,
            navigateToAdditionalInfoPage
        }
    }

// function handles all the activities of Additional info Page
    function AdditionalInfo(){

        let imdBId = location.search.substring(1);

        async function fetchMovieDescription(){
            try{
                let request = `https://www.omdbapi.com/?i=${imdBId}&plot=full&apikey=51bfef74`
            let response = await fetch(request);
            let data = await response.json();
            return data;
            }catch(error){
                console.log("error: ",error);
            }
            
        }

        function renderPage(data){
            console.log(data);
            let container = document.getElementById("container");
            container.innerHTML=` <div id="movie-Poster">
            <img src=${data.Poster} onerror="this.onerror=null;this.src='https://www.ncenet.com/wp-content/uploads/2020/04/No-image-found.jpg';" alt="NA">
        </div>
        <div id="about-movie">
            <h1 class="white-color">${data.Title}</h1>
            <h4 class="ratings">&nbsp2007 &nbsp&nbsp&nbsp IMDb Rating: ${data['Ratings'][0].Value} &nbsp&nbsp&nbsp ${data['Runtime']}</h4>
            <p class="gray-color">
                ${data.Plot}
            </p>
        </div>`;       

        }


        async function initializeAdditionalInfo(){
            let response=await fetchMovieDescription();
            renderPage(response);
        }

        return {
            initializeAdditionalInfo,
            imdBId : imdBId
        }
    }

// Controller Function to switch between 'main-page' and 'additionalInfo-Page'
    function togglePages(){
        bodyId = document.querySelector("body").id;
        console.log(bodyId);
        if(bodyId=='main-Page'){
            mainApp().initializeApp();
        }else if(bodyId=='additionalInfo-Page'){

            console.log("Body Id",bodyId)
            AdditionalInfo().initializeAdditionalInfo();
           
        }

    }
    togglePages();

