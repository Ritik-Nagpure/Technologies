import React, { useState } from 'react'

const App = () => {
  const [name, setName] = useState('');
  const [show, setshow] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(name);
    setshow(true)
  }
  const handleChange = (val) => {
    setshow(false)
    setName(val.target.value)
  }
  console.log('rendered')

  return (
    <div className='grid grid-cols-1 justify-items-center'>
      <h1>Landing Page</h1>
      <main>
        <article >
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea magni perferendis, quisquam suscipit est quod. Excepturi, cum? Beatae, molestiae mollitia facere ipsa fuga corporis. Assumenda reprehenderit ad qui fuga expedita.
        </article>
        <form onSubmit={handleSubmit} >
          <label htmlFor='Name' >Comment : </label>
          <input id='name' type='text' value={name} onChange={(e) => handleChange(e)} />

          <label htmlFor='comment' >Comment : </label>
          <input id='comment' type='text' />
          <input id='save' type='submit' value='Save Comment' />
        </form>
        {show && name}
      </main>
    </div>
  )
}

export default App