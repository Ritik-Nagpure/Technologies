// Callback hell

// nesting of callbacks
// node js callback hell
function pyramidOfDoom() {
  // first setTimeout function
  setTimeout(() => {
    console.log(1)
    // second nested setTimeout function
    setTimeout(() => {
      console.log(2)
      // third nested setTimeout function
      setTimeout(() => {
        console.log(3)
      }, 500)
    }, 2000)
  }, 1000)
};


pyramidOfDoom();