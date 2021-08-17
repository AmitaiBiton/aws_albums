
var index  = 0;
var Key_array = [];
var albumToSort = [];
$(document).ready(function () {

//#####################################################################################
  //Check login & get user info
    var pageURL = window.location.href;
    pageURL = pageURL.toString();

    // Gets url strings
    var paramIndex = pageURL.indexOf("#"); // When page is hosted on the web, use '?'
    if (paramIndex === -1) {
        return;
    }
    // Gets url parameters from AWS Cognito response including the 'access token'
    var parameters = pageURL.substring(paramIndex + 1);

    console.log(" page url: " + pageURL);
    console.log(" url parameters: " + parameters);

    // Extracts the encoded tokens from url parameters
    var idToken = getParameter(parameters, "id_token=");
    var accessToken = getParameter(parameters, "access_token=");
    console.log("id token: " + idToken);
    console.log("access token: " + accessToken);

    // Decodes the tokens
    var idTokenDecoded = atob(idToken.split('.')[1]);
    var accessTokenDecoded = atob(accessToken.split('.')[1]);
    console.log("id token decoded: " + idTokenDecoded);
    console.log("access token decoded: " + accessTokenDecoded);

    // Converts string tokens to JSON
    var idTokenJson = JSON.parse(idTokenDecoded);
    var accessTokenJson = JSON.parse(accessTokenDecoded);

    // Can now access the fields as such using the JSON.parse()
    console.log("email: " + idTokenJson.email);
    console.log("id: " + idTokenJson.sub);
    console.log("Name: " + idTokenJson.name);


    $('#greetings').text("Hello, "+idTokenJson.name);
    $('#email').text("You Are Signed In Using: " + idTokenJson.email);
    console.log("Username: "+ accessTokenJson.username);

//#####################################################################################

  $("#delete_image").click(function(){
    var modal2 = document.getElementById("myModal2");
    var span2 = document.getElementsByClassName("close2")[0];
    modal2.style.display = "block";
    span2.onclick = function() {
      modal2.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal2) {
        modal2.style.display = "none";
      }
    }
    $('.Delete').click(function(){
      let Key = {
        "Key":""+document.getElementById("Key_input").value+idTokenJson.email+""
      }
      console.log(Key)
      let xhttp;
      const API_ENDPOINT = "https://ocjs4rtyv1.execute-api.us-east-2.amazonaws.com/v1";
      xhttp = new XMLHttpRequest();
      let urlString = API_ENDPOINT;
      urlString += "/";

      xhttp.onreadystatechange = function() { response();}
      xhttp.open("DELETE", API_ENDPOINT, true);
      
      xhttp.setRequestHeader('Content-Type', 'application/json');
      xhttp.send(JSON.stringify(Key));
  
      function response(){
        if ( xhttp.readyState == 4 &&  xhttp.status == 200){
          res = JSON.parse(xhttp.responseText);
          console.log(res)
          alert("Image deleted successfully!")
          modal.style.display = "none";
          $('.seeAlbum').trigger('click');
          
        }
      } 
      e.preventDefault();
    });
  

  });



  $( "#addAlbum" ).click(function() {
    
    var modal = document.getElementById("myModal");
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick = function() {
      modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }
    
    $( ".new_image" ).click(function(e) {
      let lname_val = document.getElementById("lname").value
      let Date_val = document.getElementById("Date").value
      let Key_val = document.getElementById("Key").value
      var inpObj = document.getElementById("Key")
      if (!inpObj.checkValidity()) {
        alert("please enter number")
      }
      else{
        if (serach_key_exist(Key_array,Key_val )===true){
            alert("please enter number dif")
        }
        Key_array.push(Key_val)

        
        let xhttp;
        const API_ENDPOINT = "https://bmbgk7odj7.execute-api.us-east-2.amazonaws.com/v2";
        
        let Item = {
          "Key":Key_val+idTokenJson.email,
          "date_client" :Date_val,
          "email":idTokenJson.email,
          "link": lname_val,
          
        }

        xhttp = new XMLHttpRequest();
        let urlString = API_ENDPOINT;
        urlString += "/";

        xhttp.onreadystatechange = function() { response();}
        xhttp.open("POST", API_ENDPOINT, true);
        
        xhttp.setRequestHeader('Content-Type', 'application/json');
        xhttp.send(JSON.stringify({"Item": Item}));
    
        function response(){
          if ( xhttp.readyState == 4 &&  xhttp.status == 200){
            res = JSON.parse(xhttp.responseText);
            console.log("RES:",res)
            console.log("ststus" , xhttp.status)
            alert("Image uploaded successfully!");
            modal.style.display = "none";
            $('.seeAlbum').trigger('click');
          }
        }
        
        e.preventDefault();
      }
    });
      



    
  });





  $( ".seeAlbum" ).click(function() {
   
    // create form with btn to sort the mages
    /*
    var f = document.createElement("form");
    var i = document.createElement("input"); //input element, text
    i.setAttribute('type',"text");
    i.setAttribute('value',"Key");
    var s = document.createElement("input"); 
    s.setAttribute('type',"submit");
    s.setAttribute('value',"Sort");
    f.appendChild(i);
    f.appendChild(s);
    document.getElementsByTagName('body')[0].appendChild(f);
    */
    
    let res;
    let xhttp;
    const API_ENDPOINT = "https://04qp22rxq2.execute-api.us-east-2.amazonaws.com/v1";

    //var params = {"email": idTokenJson.email};
   
    xhttp = new XMLHttpRequest();
    let urlString = API_ENDPOINT;
    //urlString += "/";
    //{"email": {"S": "saharmalka@gmail.com"}}
    urlString += "/{email}="+idTokenJson.email;
    xhttp.onreadystatechange = function(){response();}
    xhttp.open("GET" , urlString ,true);
    xhttp.send();

    function response(){
      if ( xhttp.readyState == 4 &&  xhttp.status == 200){
        res = JSON.parse(xhttp.responseText);
        
        console.log(res);
        console.log(typeof(res));
        //console.log(res[0].email);
        //console.log(Object.values(res[0].email));
        //alert(Object.values(res[0].email));
        generate_album(res);
        
      }
      else{console.log(xhttp.responseText)}
    }
    
    
  });


  function generate_album(data) {
     

    var user_album = [];
    var user_images = [];
    
    var j = 0;
    for (var i = 0 ; i < data.length ; i++)
    {
      if(Object.values(data[i].email) == idTokenJson.email)
      {
        var image = {};
        image.email = Object.values(data[i].email)[0];
        image.key = Object.values(data[i].Key)[0];
        image.image = Object.values(data[i].image_source)[0];
        image.date = Object.values(data[i].date_client)[0];
        user_images[j] = image;
        j++;
      }
    }

    albumToSort = user_images;
    console.log(user_images);
    draw_album(user_images);
    
    
  }


    $( "#sortDate" ).click(function() {
      var byDate = albumToSort.slice(0);
      byDate.sort(function(a,b) {
        return a.date - b.date;
      });
      console.log('by date:');
      console.log(byDate);
      draw_album(byDate);
    });

    $( "#sortKey" ).click(function() {
      var byKey = albumToSort.slice(0);
      byKey.sort(function(a,b) {
          var x = a.key.toLowerCase();
          var y = b.key.toLowerCase();
          return x < y ? -1 : x > y ? 1 : 0;
      });

      console.log('By Key:');
      console.log(byKey);
      draw_album(byKey);
    });

    

    function draw_album(user_album) {
      if (index ==1){
        document.getElementById("table_body").remove()
        index =0
      }
      // get the reference for the body
      var body = document.getElementsByTagName("body")[0];
      var ind =0;
      // creates a <table> element and a <tbody> element
      var tbl = document.getElementById("picturesTable");
      var tblBody = document.createElement("tbody");
      tblBody.setAttribute("id", "table_body");
      // creating all cells
      length  =  parseInt(user_album.length/4)+1
      for (var i = 0; i < length; i++) {
        // creates a table row
      
        var row = document.createElement("tr");
    
        for (var j = 0; j < 4; j++) {
          // Create a <td> element and a text node, make the text
          // node the contents of the <td>, and put the <td> at
          // the end of the table row
          if (ind==user_album.length){
            break;
          }
          var cell = document.createElement("td");
          const img = document.createElement("img");
          var img_key = document.createElement("h3");
          var img_date = document.createElement("h3");
          const popup_img = document.createElement("img");
          img.src = user_album[ind].image;
          //var clean_key = 
          img_key.innerHTML = (user_album[ind].key).replace(idTokenJson.email,'');
          img_date.innerHTML = user_album[ind].date;
          popup_img.src = user_album[ind].image;
          img.addEventListener('click', function (e) {
            var modal = document.getElementById("myModal1");
            var span = document.getElementsByClassName("close1")[0];
            var image = document.getElementById("image");
            image.appendChild(popup_img)
            
            modal.style.display = "block";
            span.onclick = function() {
              modal.style.display = "none";
              popup_img.remove()
            }
            // When the user clicks anywhere outside of the modal, close it
            window.onclick = function(event) {
              if (event.target == modal) {
                modal.style.display = "none";
              }
            }
            
          });
          
          ind +=1
          
          cell.appendChild(img);
          cell.appendChild(img_key);
          cell.appendChild(img_date);
          row.appendChild(cell);
        }
    
        // add the row to the end of the table body
        tblBody.appendChild(row);
        
      }
      
      // put the <tbody> in the <table>
      tbl.appendChild(tblBody);
      // appends <table> into <body>
      //body.appendChild(document.createElement("button"))
      body.appendChild(tbl);
      // sets the border attribute of tbl to 2;
      tbl.setAttribute("border", "0");
      
      $( "#filters" ).css("visibility", "visible");
      $( "#pictures" ).css("visibility", "visible");
      index =1;
    }







});






  

  function getParameter(url, param) {
    var urlVars = url.split('&');
    var returnValue;
    for (var i = 0; i < urlVars.length; i++) {
        var urlParam = urlVars[i];

        // get up to index.
        var index = urlParam.toString().indexOf("=");
        urlParam = urlParam.substring(0, index + 1);
        if (param === urlParam) {
            returnValue = urlVars[i].replace(param, "");
            i = urlVars.length; // exits for loop
        }
    }
    return returnValue;
}

function serach_key_exist(arr , key){
  console.log(key , arr)
  var found = false;
  for(var i = 0; i < arr.length; i++) {
    if (arr[i]== key) {
        found = true;
        break;
    }
  }
    return found
}
function checkImage(url) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.send();
  request.onload = function() {
    status = request.status;
    if (request.status == 200) //if(statusText == OK)
    {
      return true
    } else {
      return false
    }
  }
}

/*
$(document).ready(function () {

   
  //var headerToken = "Bearer "+...

  $.ajax({
            url: "https://amitaibiton.auth.us-east-2.amazoncognito.com/oauth2/userInfo",
            type: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': headerToken
            },
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
               alert(result);
            },
            error: function (error) {
                alert(error);
            }
        });


$.ajax({
            url: "https://amitaibiton.auth.us-east-2.amazoncognito.com/oauth2/token",
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function (result) {
               alert(result[0].email)
            },
            error: function (error) {
                //alert(error);
            }
        });



  $( ".seeAlbum" ).click(function() {
    let xhttp;
    const API_ENDPOINT = "https://0bs0oty50d.execute-api.us-east-2.amazonaws.com/v1";
    $("#button").click(function() {
        
        xhttp = new XMLHttpRequest();
        let urlString = API_ENDPOINT;
        urlString += "/";
        xhttp.onreadystatechange = function(){response();}
        xhttp.open("GET" , urlString ,true);
        xhttp.send();

    });

     function response(){
          if ( xhttp.readyState == 4 &&  xhttp.status == 200){
               alert("send")
              let res = JSON.parse(xhttp.responseText);
               $("#profile").attr("src", res.message);
          }
        }
  });



  $("#pictures").hide();
  //Get all albums
  $.ajax({
    url: "http://localhost:3001/albums",
    headers: { "X-My-Custom-Header": "some value" },
    success: function (result) {
      $.each(result, function (index, element) {
        var newTable = $("#albumsTable").append(
          $(
            "<tr><td>" +
              element.id +
              "</td><td>" +
              element.name +
              "</td><td>" +
              element.type +
              "</td><td><div class='albumButtons' name='kaki' id='show" +
              element.id +
              "'>Show Album</div></td><td><div class='albumButtons' id='addToAlbum" +
              element.id +
              "'>Add Photo</div></td><td><div class='albumButtons'  id='del" +
              element.id +
              "'>Delete Album</div></td></tr>"
          )
        );
       
        //Get spesific album photos by ID
        $("#show" + element.id).click(function () {
          $("#albums").hide();
          $("#pictures").show("slow");
          $("#albumName").html(element.name);
          if (jQuery.isEmptyObject(element.pictures)) {
            $("#picturesTable").append("<h2>Album is empty.</h2>");
          } else {
            $.each(element.pictures, function (index, picture) {
              $("#picturesTable").append(
                $(
                  "<tr><td>" +
                    picture.name +
                    "</td><td>" +
                    picture.photographer +
                    "</td><td><img src='" +
                    picture.link +
                    "'</td></tr>"
                )
              );
            });
          }
        });

        $("#addToAlbum" + element.id).click(function () {
          console.log(element.id);
          localStorage.setItem("clickedId", element.id);
          window.open("http://localhost:3001/add_picture", "_self");
        });

        $("#del" + element.id).click(function () {
          if (confirm("Are you sure you want to delete this album?")) {
            console.log("Album deleted succsecfully!");

            $.ajax({
              type: "DELETE", // define the type of HTTP verb we want to use (POST for our form)
              url: "http://localhost:3001/albums/" + element.id, // the url where we want to POST
              contentType: "application/json",

              success: function (result) {
                console.log(result);
              },
              error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
              },
            });
            location.reload();
          } else {
            // Do nothing!
            console.log("Album was not deleted.");
          }
        });
      });

      console.log(result);
    },
    error: function (err) {
      console.log("err", err);
    },
  });
});
*/