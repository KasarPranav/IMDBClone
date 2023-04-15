//`http://www.omdbapi.com/?s=thor&page=1&apikey=51bfef74

function mainApp(){
        let search="";
        const MOVIE_NOT_FOUND = "Movie not found!";
        let searchResultsArray =[];
        let API ="";
        const popularList = `http://www.omdbapi.com/?s=Avengers&page=1&apikey=51bfef74`;

        let searchInput = document.getElementById("search-div");
        let movieContainer = document.getElementById("movies-container");
        const favLists = document.getElementById('list');


        function renderList(moviesList){
            let elementList=[];
            
            for(let i=0;i<moviesList.length;i++){
                let element=renderMovie(moviesList[i]);
                elementList.push(element); 
                movieContainer.append(element);
            }
            
        }

        function renderMovie(movie){
            const element = document.createElement("div");
            element.innerHTML=`<div class="movies">
            
            <div class="movie-poster">
            <img src=${movie['Poster']} alt="">
        </div>

            <div class="movie-info">
                
                <div class="gray-color">
                    <span>
                        <img class="svg-img" src="Assets/icons8-star-filled-48.png" alt="">
                    </span>
                    <span class="imdB">8.0</span>
                </div>
                <div class="add-To-Fav-container">
                    <button data-id=${movie['imdbID']} class="add-To-Fav">
                        +
                    </button>
                </div>
                <div class="movie-Title">
                <a class="disableTextDecoration movieId" data-href="#" onclick='mainApp().navigateToAdditionalInfoPage(this.dataset.id)' data-id="${movie['imdbID']}">
                <p class="white-color">
                ${movie['Title']}
            </p>
                </a>
                </div>  
            
                
            </div>
        </div>`

        return element;
        }

        function renderFavourites(){
            favLists.innerHTML="";
            for (let x=0;x<localStorage.length;x++){
                    // console.log(x);
                    const jsonObj = parseLocalStorage(localStorage.key(x));
                    // console.log("This JSON",jsonObj);
                    if(jsonObj!=null){
                        const li = document.createElement('li');
                        li.innerHTML = `<li>
                                        <div class="fav-list-Item">
                                            <img class="fav-Poster" src=${jsonObj['Poster']} class="" alt="">
                                            <span>
                                                <img src="assets/delete-button-svgrepo-com.svg" class="delete" data-id="${jsonObj['imdbID']}"/>
                                                <a class="disableTextDecoration movieId" href="#" onclick='mainApp().navigateToAdditionalInfoPage(this.dataset.id)' data-id="${jsonObj['imdbID']}">
                                                <p class="white-color fav-Title">${jsonObj['Title']}</p>
                                                </a>
                                                <p class="gray-color">${jsonObj['Year']}</p>
                                            </span>                                    
                                        </div>
                                    </li>`
                        favLists.append(li);                        
                    }                    
            }
        }


        function handleInput(event){
            if(event.target.id=="search-box"){
                let input=event.target.value;
                let key=input.replace(" ","+");
                search=key;
                API = `http://www.omdbapi.com/?s=${search}&page=1&apikey=51bfef74`;        
                fetchMovies(API);
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
        function removeMovieFromFavourites(id){
            localStorage.removeItem(id);
            renderFavourites();
        }

        function addMovieToFavourite(movieId){
        const findMovie = window.localStorage.getItem(movieId);
        if(findMovie!=null){
                return;
        }
        const myFavMovie = searchResultsArray.filter((movie)=>{
                return movie['imdbID']==movieId;
            })
            console.log(myFavMovie);
            addToFav(myFavMovie[0]);
            renderFavourites();
        }

        function addToFav(favMovie){
            const id=favMovie['imdbID'];
            const stringifyMovie = JSON.stringify(favMovie);
            localStorage.setItem(id,stringifyMovie);
        }
        
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
                //console.log("error: ",error);
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

        function initializeApp(){
            fetchMovies(popularList);
            renderFavourites();
            document.addEventListener('keyup',handleInput);
            document.addEventListener('click',handleClick);
        }

        return {
            initializeApp : initializeApp,
            navigateToAdditionalInfoPage
        }
    }

    function AdditionalInfo(){

        let imdBId = location.search.substring(1);

        async function fetchMovieDescription(){
            try{
                let request = `http://www.omdbapi.com/?i=${imdBId}&plot=full&apikey=51bfef74`
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
            <img src=${data.Poster} alt="NA">
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

