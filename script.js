const $form = document.querySelector('.ip-input')
let ip = ''
let error = false

//this creates a leafletjs map
var map = L.map('map');

L.tileLayer(`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=tIc1i1kUs9AT4rg7mh1B`, {
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    crossOrigin: true
}).addTo(map);



//initialize with an IP for google
loadIP('8.8.8.8')

//listens for a submit
$form.addEventListener('submit', ev => {
    ev.preventDefault()

    loading(true)
    //sets ip to the user inputted value
    loadIP($form.elements['ip'].value)
})

//loads the info for the ip and displays it
function loadIP(ip) {
    getIPInfo(ip).then(info => {
        //update the displayed info if there is no error, if there is clear the content
        if (error) {
            document.querySelectorAll('.ip-property-value').forEach(el => {
                el.innerHTML = ''
            })
        } else {
            updateIPInfo(info)
        }
        console.log(info)
    })
}

//gets data from the ipify api
async function getIPInfo(ip) {

    let type = ''

    //changes the api url depending on whether it's a domain or an ip
    if (ip.toLowerCase().match(".*[a-z].*") && !ip.includes(':')) {
        type = 'domain'
    } else {
        type = 'ipAddress'
    }

    console.log(ip)
    let res = await fetch(`https://geo.ipify.org/api/v1?apiKey=at_Wnsrnezdn0bKFv0UaxLezbhSOKoXQ&${type}=${ip}`)//dont touch it :) it's a free account anyways

    //handle an error
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

//outputs the ip information into the dom
function updateIPInfo(info) {
    //stops the loading animation
    loading(false)
    map.setView([info.location.lat, info.location.lng], 17)

    document.querySelector('.ip-address').textContent = info.ip
    document.querySelector('.ip-location').textContent = `${info.location.city}, ${info.location.region} ${info.location.postalCode}`
    document.querySelector('.ip-timezone').textContent = `UTC${info.location.timezone}`
    document.querySelector('.ip-isp').textContent = info.isp
}

//adds or removes an animated svg to indicate that the data is loading
//should be changed to a css keyframe animation for better support
function loading(status) {
    const $ipPropertyValues = document.querySelectorAll('.ip-property-value')

    if (status) {
        $ipPropertyValues.forEach(el => {
            //adds loading svgs
            el.innerHTML = `<img class="loading-svg" style="background: none" src="./images/Rolling-1s-200px.svg">`
        })
    } else {
        $ipPropertyValues.forEach(el => {
            //removes loadings svgs
            el.innerHTML = ''
        })
    }
}

function fixMap(lat, lng) {
    map.panTo(lat, lng)
    map.setZoom(10)
}
