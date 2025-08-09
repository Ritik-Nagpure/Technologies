

 fetch('https://dog.ceo/api/breeds/image/random')
          .then(response => response.json()) // Parses the JSON from the response
          .then(data => console.log(data)) // 'data' is now a JavaScript object
          .catch(error => console.error('Error:', error));

// console.log(a);
