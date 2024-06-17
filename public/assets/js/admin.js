function processSkillsForm(e) {
    e.preventDefault()
    const skillsData = {
        age: document.querySelector('#age-input').value,
        concerts: document.querySelector('#concerts-input').value,
        cities: document.querySelector('#cities-input').value,
        years: document.querySelector('#years-input').value 
      }

      sendRequest('/admin/skills', skillsData, 'POST', data => {
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
   
  const skillsForm = document.querySelector('#skills-form')
  skillsForm.addEventListener('submit', processSkillsForm)



