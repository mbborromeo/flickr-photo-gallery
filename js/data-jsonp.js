/*
 * Exercise: Photo Lightbox with API call to Flickr
 * Technology: Javascript, CSS, HTML
 * Author: Michael Borromeo
 * Date: 27 June 2019
 *
 * Note: Flickr API call on index.html page has a callback function to jsonFlickrApi() which I defined below.
 */

var imageID = "";
var TOTAL_NUMBER_OF_IMAGES;
var responseObject; //JSON response object from Flickr API call

//Render image in lightbox with previous/next buttons
function renderImage( id ){
    if( id >= 0 && id <= TOTAL_NUMBER_OF_IMAGES-1 ){
        imageID = id;

        //Convert from mobile to big Flickr image size
        let largePhoto = responseObject.items[ imageID ].media.m.replace("_m", "_b");
        document.getElementById("imgFull").getElementsByTagName("img")[0].src = largePhoto;

        //Wait until image has loaded before changing title and updating buttons
        document.getElementById("imgFull").getElementsByTagName("img")[0].addEventListener(
            "load", 
            function(){
                document.getElementById("heading").innerHTML = responseObject.items[ imageID ].title;
                
                showButtons();
            
                //Show photo frame
                document.getElementById("imgFull").style.opacity = "1";             
            }
        );
    }
}

function showButtons() {
    if( imageID == 0 ){
        document.getElementById("prevBtn").style.display = "none";
        document.getElementById("nextBtn").style.display = "block";
    } else if( imageID == TOTAL_NUMBER_OF_IMAGES-1 ){
        document.getElementById("nextBtn").style.display = "none";
        document.getElementById("prevBtn").style.display = "block";
    } else {
        document.getElementById("prevBtn").style.display = "block";
        document.getElementById("nextBtn").style.display = "block";
    }
}

//Dynamically assigned to div tile onclick inside buildImageTiles() for loop
function displayModal( index ){
    renderImage( index );

    document.getElementById("display").style.display = "block";

    setTimeout( 
        function(){
          document.getElementById("display").style.opacity = "1";
        },
        25
    );
}

//Close modal popup and reset details inside
function clearImage() {
    document.getElementById("imgFull").getElementsByTagName("img")[0].src = "";
    document.getElementById("heading").innerHTML = "";
    document.getElementById("imgFull").style.opacity = "0";
}

function buildImageTiles(){
    TOTAL_NUMBER_OF_IMAGES = responseObject.items.length;
    let imagesArray = new Array();
    let newContent = "";    

    //Preload images into array and dynamically build the content for the image tiles
    responseObject.items.forEach( function (currentItem, i) {        
        imagesArray[i] = new Image();
        imagesArray[i].src = currentItem.media.m; //m is for mobile-sized Flickr image

        newContent += '<div class="tile" data-id="' + i + '" ' + 'onclick="displayModal(' + i + '); ">' +
                        '<div class="background-tile" style="background-image: url(' + imagesArray[i].src + ');" >' +
                          '<div class="hover-text">' +
                                '<span>' + currentItem.title + '</span>' +
                                '<br />' +
                                currentItem.date_taken +
                          '</div>' +
                        '</div>' +
                       '</div>';
    });

    //Update page with built image tiles
    document.getElementById("container").innerHTML = newContent;
}

//Load JSON from Flickr API call on index.html page
function jsonFlickrApi( data ){    
    /*
    //To Do: Possible check if returned data from API call is not OK
    if(data.stat != "ok"){
        console.log("Error reading JSON API call");
		return; //Exit, do not continue
	}
    */

    responseObject = data;    
    buildImageTiles();    
};

//When window has loaded webpage, including images and scripts
window.onload = function(){
    //Fade in content when all images have loaded
    document.getElementById("section-gallery").style.background = "none";
    document.getElementById("container").style.opacity = "1";

    function previousOrNextImage( inc ){
        let proposedImageID =  imageID + inc;
        renderImage( proposedImageID );
    }
    
    function closeModal(){
        document.getElementById("display").style.opacity = "0";

        setTimeout(
            function(){
              clearImage();
              document.getElementById("display").style.display = "none";              
            },
            525
        );
    }

    //Event listeners for user's interactions
    
    //When hover on modal display, change mouse cursor to pointer to indicate its clickable
    document.getElementById("display").addEventListener("mouseover", function(ev){
        let target = ev.target.tagName.toLowerCase();

        //Cater for event propagation to children.  Only want to register event for the parent
        if( target === 'div' ){
            this.style.cursor = "pointer";
        }
        else{ //ie. figure, img, figcaption
            this.style.cursor = "default";
        }
    });

    //Close modal display when users clicks outside the image (on modal display)
    document.getElementById("display").addEventListener("click", function(ev){
        let target = ev.target.tagName.toLowerCase();

        //Cater for event propagation to children.  Only want to register event for the parent
        if( target === 'div' ){
            closeModal();
        }
    });

    //Event handlers for buttons
    document.getElementById("prevBtn").addEventListener("click", function(){
        previousOrNextImage(-1);
    });

    document.getElementById("nextBtn").addEventListener("click", function(){
        previousOrNextImage(1);
    });
}
