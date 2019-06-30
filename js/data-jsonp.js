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

        //Convert to big-sized Flickr image
        let largePhoto = responseObject.items[ imageID ].media.m.replace("_m", "_b");
        document.getElementById("imgFull").getElementsByTagName("img")[0].src = largePhoto;

        //Wait until image has loaded before changing title
        document.getElementById("imgFull").getElementsByTagName("img")[0].addEventListener("load",
            function(){
                document.getElementById("heading").innerHTML = responseObject.items[ imageID ].title;

                //Show figure container
                document.getElementById("imgFull").style.opacity = "1";

                showButtons();
            }
        );
    }
}

//Show Previous/Next buttons
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

//Hide Previous/Next buttons
function hideButtons() {
    document.getElementById("prevBtn").style.display = "none";
    document.getElementById("nextBtn").style.display = "none";
}

//Clear image and description
function clearImage() {
    document.getElementById("imgFull").getElementsByTagName("img")[0].src = "";
    document.getElementById("heading").innerHTML = "";
    document.getElementById("imgFull").style.opacity = "0";
}

//Assigned to div image tile inside jsonFlickrApi for-loop and called when image tile is clicked
function displayModal( index ){
    //Empty image and button placeholder
    clearImage();
    hideButtons();

    renderImage( index );

    document.getElementById("display").style.display = "block";

    setTimeout( function(){
          document.getElementById("display").style.opacity = "1";
        }, 25
    );
}

//Load JSON from Flickr API call
function jsonFlickrApi( data ){
    //To Do: Possible check if returned data from API call is not OK
    /*
    if(data.stat != "ok"){
        console.log("Error reading JSON API call");
		return; //Exit, do not continue
	}
    */

    //If status is OK, continue
    responseObject = data;
    TOTAL_NUMBER_OF_IMAGES = responseObject.items.length;
    let imagesArray = new Array(); //array to preload images into
    let newContent = "";

    //ES6 forEach on array to build content of image thumbnails
    responseObject.items.forEach( function (currentItem, i) {
        //Preload images
        imagesArray[i] = new Image();
        imagesArray[i].src = currentItem.media.m; //Use mobile-sized Flickr image

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

    //Update page with new content of image tiles
    document.getElementById("container").innerHTML = newContent;
};

//When window has loaded webpage, including images and scripts, then add event listeners for user's interactions
window.onload = function(){
    //Fade in content when all images have loaded
    document.getElementById("section-gallery").style.background = "none";
    document.getElementById("container").style.opacity = "1";

    //Modal display buttons
    function previousOrNextImage( inc ){
        let proposedImageID =  imageID + inc;
        renderImage( proposedImageID );
    }

    //When hover on modal display, change mouse cursor to pointer to indicate its clickable
    document.getElementById("display").addEventListener("mouseover", function(ev){
        let target = ev.target.tagName.toLowerCase();

        //Cater for event propagation to children.  Only want to the click on the parent, which is a 'div' in this case
        if( target === 'div' ){
            this.style.cursor = "pointer";
        }
        else{
            this.style.cursor = "default";
        }
    });

    //When click on modal display, hide modal display
    document.getElementById("display").addEventListener("click", function(ev){
        let target = ev.target.tagName.toLowerCase();

        //Cater for event propagation to children.  Only want to register a click on the parent, which is a 'div' in this case.
        if( target === 'div' ){
            this.style.opacity = "0";

            setTimeout(
                function(){
                  document.getElementById("display").style.display = "none";
                  clearImage();
                },
                525
            );
        }
    });

    //Event handlers for Prev/Next buttons
    document.getElementById("prevBtn").addEventListener("click", function(){
        previousOrNextImage(-1);
    });

    document.getElementById("nextBtn").addEventListener("click", function(){
        previousOrNextImage(1);
    });
}
