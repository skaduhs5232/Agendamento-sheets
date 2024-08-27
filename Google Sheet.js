const scriptURL = 'https://script.google.com/macros/s/AKfycbxhD6da0dvx3rQgGChA5NsfQ7hLE7wGTYIfTSfMEoa-esFP9K2vpPUinj6v_xhkXB2sTg/exec'


const form = document.forms['contact-form']


form.addEventListener('submit', e => {
  e.preventDefault()
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
  .then(response => alert("Thank you! your form is submitted successfully." ))
  .then(() => { window.location.reload(); })
  .catch(error => console.error('Error!', error.message))
})
