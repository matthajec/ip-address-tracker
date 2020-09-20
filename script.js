const $form = document.querySelector('.ip-input')

let ip = ''
let error = false

//gets data from the ipify api
async function getIPInfo(ip) {

  let type = ''
  //if the input contains letters but not a : (for ipv6 address) then it must a domain, if not it's an ip
  if (ip.match(".*[a-z].*") && !ip.includes(':')) {
    type = 'domain'
  } else {
    type = 'ipAddress'
  }

  let res = await fetch(`https://geo.ipify.org/api/v1?apiKey=at_Wnsrnezdn0bKFv0UaxLezbhSOKoXQ&${type}=${ip}`)//dont touch it :) it's a free account anyways

  //set error to true or false depending on if the promise is ok
  if (!res.ok) {
    error = true

    //alerts the user there is an issue
    alert(`${res.status}: ${res.statusText}
Did you input a valid IP/domain? If you're sure the IP/domain is valid, try again later.`)
  } else {
    error = false
  }

  let data = await res.json()
  return data
}

//puts the ip information into the dom
function updateIPInfo(info) {
  //removes the loading svgs
  loading(false)
  document.querySelector('.ip-address').textContent = info.ip
  document.querySelector('.ip-location').textContent = `${info.location.city}, ${info.location.region} ${info.location.postalCode}`
  document.querySelector('.ip-timezone').textContent = `UTC${info.location.timezone}`
  document.querySelector('.ip-isp').textContent = info.isp
}

//adds or removes an animated svg to indicate that the data is loading
//i should change this to a css keyframe animation for better support
function loading(status) {
  const $ipPropertyValues = document.querySelectorAll('.ip-property-value')

  if (loading) {
    $ipPropertyValues.forEach(el => {
      el.innerHTML += `
        <img class="loading-svg" style="background: none" src="./images/Rolling-1s-200px.svg">
      `
    })
  } else {
    $ipPropertyValues.forEach(el => {
      el.innerHTML = ''
    })
  }
}

//listens for a submit
$form.addEventListener('submit', ev => {
  ev.preventDefault()

  loading(true)
  //sets ip to the user inputted value
  ip = $form.elements['ip'].value

  getIPInfo(ip).then(info => {
    //handles errors
    if (error) {
      //resets the displayed text to nothing
      document.querySelectorAll('.ip-property-value').forEach(el => {
        el.innerHTML = ''
      })
    } else {
      updateIPInfo(info)
    }

    console.log(info)
  })
})

