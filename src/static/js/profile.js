function initProfile () {
  let name = document.getElementById('name')
  let email = document.getElementById('email')
  let password = document.getElementById('password')
  let description = document.getElementById('description')
  let editButton = document.getElementById('edit-button')
  let logoutLink = document.getElementById('logout-link')
  let deleteAccountLink = document.getElementById('delete-account-link')
  fetchJSON(
    '/profile',
    'GET',
    null,
    {
      'Authorization': 'Bearer ' + localStorage.getItem('jwt')
    },
    (data) => {
      name.value = data.name
      email.value = data.email
      password.value = data.password
      description.value = data.description
    },
    (errMessage) => {
      localStorage.removeItem('jwt')
      location.replace('/../../')
    }
  )
  logoutLink.onclick = () => {
    googleSignOut()
    localStorage.removeItem('jwt')
    location.replace('/../../')
  }
  editButton.onclick = () => {
    fetchJSON(
      '/profile',
      'PUT',
      {
        name: name.value,
        description: description.value
      },
      {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      },
      (data) => {
        location.reload()
      },
      (errMessage) => {
        localStorage.removeItem('jwt')
        location.replace('/../../')
      }
    )
  }
  deleteAccountLink.onclick = () => {
    fetchJSON(
      '/profile',
      'DELETE',
      {},
      {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt')
      },
      (data) => {
        googleSignOut()
        localStorage.removeItem('jwt')
        location.replace('/../../')
      },
      (errMessage) => {
        localStorage.removeItem('jwt')
        location.replace('/../../')
      }
    )
  }
}
