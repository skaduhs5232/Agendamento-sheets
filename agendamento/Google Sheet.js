const scriptURL = 'https://script.google.com/macros/s/AKfycbxhD6da0dvx3rQgGChA5NsfQ7hLE7wGTYIfTSfMEoa-esFP9K2vpPUinj6v_xhkXB2sTg/exec'
const form = document.forms['contact-form']
const loading = document.getElementById('loading')

form.addEventListener('submit', e => {
  e.preventDefault()
  
  loading.style.display = 'flex'
  
  fetch(scriptURL, { method: 'POST', body: new FormData(form)})
    .then(response => {
      alert("Obrigado, seu cadastro foi adicionado, fique de olho na data!")
    })
    .then(() => {
      loading.style.display = 'none'
      window.location.reload()
    })
    .catch(error => {
      console.error('Error!', error.message)
      loading.style.display = 'none' 
    })
})
