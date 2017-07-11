function get(url, callback) {
  var request = new XMLHttpRequest();

  request.onreadystatechange = function() {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        return callback(null, JSON.parse(request.responseText));
      }
      else if (request.status === 400) {
        return callback(new Error('There was an error 400'), null);
      }
      else {
        return callback(new Error('something else other than 200 was returned'), null);
      }
    }
  };

  request.open('GET', url, true);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send();
};
document.addEventListener('DOMContentLoaded', function(){
  var select = document.getElementById('person');
  var button = document.getElementById('button');
  button.addEventListener('click', function(e){
    e.preventDefault();
    var id = Number(select.value);
    get('/person/' + id + '/chores', function(error, response){
    if (error){
      console.error(error);
     return;
    }
    for (var i = 0; i < response.length; i++){
      console.log(response[i].name);
    }


    });
  })
})