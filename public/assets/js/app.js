function processEmailForm (e) {
    e.preventDefault()
    const data = {
      name: document.querySelector('#name-input').value,
      email: document.querySelector('#email-input').value,
      message: document.querySelector('#message-input').value 
    }

   
    sendRequest('/', data, 'POST', data => {
        contactForm.reset()
    })
  }
   
  function sendRequest (url, data, method, cb) {
    let xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onload = function () {
      let result
      try {
        result = JSON.parse(xhr.responseText)
      } catch (err) {
        cb({ msg: 'Некорректные данные', status: 'Error' })
      }
      cb(result)
    }
    xhr.send(JSON.stringify(data))
  }
   
  const contactForm = document.querySelector('#mail')
  contactForm.addEventListener('submit', processEmailForm)

  