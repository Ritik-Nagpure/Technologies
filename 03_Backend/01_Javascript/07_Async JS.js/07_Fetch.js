// Read about xhr in ajax

// fetch-dog.js

// ✅ Purpose:
// This script demonstrates how to use the Fetch API to make a simple GET request
// to a public API (Dog CEO API) that returns a random dog image.

// ✅ API Endpoint:
// https://dog.ceo/api/breeds/image/random

// ✅ What it returns:
// A JSON object like:
// {
//   "message": "https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg",
//   "status": "success"
// }

// ✅ Step-by-step breakdown:

// 1️⃣ Make a GET request using fetch
fetch('https://dog.ceo/api/breeds/image/random')

  // 2️⃣ Handle the response and convert it to JSON
  .then(response => {
    // Check if the response is OK (status code 200–299)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json(); // Parse the JSON body
  })

  // 3️⃣ Use the parsed data
  .then(data => {
    console.log('Request Status : ', data.status); // Log the image URL
    console.log('🐶 Random Dog Image URL:', data.message); // Log the image URL
  })

  // 4️⃣ Handle any errors that occur during fetch or parsing
  .catch(error => {
    console.error('❌ Error fetching dog image:', error);
  });
