class Glitt {
    id;
    user;
    text;
    datetime;

    constructor(data) {
        this.id = data.id;
        this.user = data.user;
        this.text = data.text;
        this.datetime = new Date(data.datetime).toLocaleDateString() + " "+ new Date(data.datetime).toLocaleTimeString();
    }
}

function renderCard(glitt) {
    return `
    <div class="uk-card uk-card-default uk-width-1-2@m gl-container-center" style="margin-bottom: 30px;">
        <div class="uk-card-header">
            <div class="uk-grid-small uk-flex-middle" uk-grid>
                <div class="uk-width-auto">
                    <img class="uk-border-circle" width="40" height="40" src="https://i.pravatar.cc/40" alt="Avatar">
                </div>
                <div class="uk-width-expand">
                    <h3 class="uk-card-title uk-margin-remove-bottom">${glitt.user}</h3>
                    <p class="uk-text-meta uk-margin-remove-top"><time>${glitt.datetime}</time></p>
                </div>
            </div>
        </div>
        <div class="uk-card-body">
            <p>${glitt.text}</p>
        </div>
    </div>
    `
}

function displayGlitts(glitts) {
    document.getElementById("gl-card-container").innerHTML = null

    glitts
        .map(glitt => renderCard(glitt))
        .forEach(glitt => document.getElementById("gl-card-container").innerHTML += glitt)
}

/**
 * Handles the onClick event of the save button when creating a new Glitt. 
 * 
 */
function saveGlitt() {
    const glittText = document.getElementById("gl-glitt-text").value;
    const glittName = document.getElementById("gl-glitt-name").value;
    postGlittToBackend(glittName, glittText)
}

function resetForm() {
    document.getElementById("gl-glitt-text").value = null;
    document.getElementById("gl-glitt-name").value = null;
}

function hideModal() {
    const modalElement = document.getElementById("gl-create-glitt-modal")
    UIkit.modal(modalElement).hide();
}

/**
 * This function fetches the data from the backend. 
 * 
 */
function getGlittsFromBackend() {
    fetch("http://localhost:4000/glitts")
        .then(res => res.json())
        .then(json => {
            const glitts = json.map(glitt => new Glitt(glitt))
            displayGlitts(glitts)
        })
}

function postGlittToBackend(glittName, glittText) {
    const fetchConfig = {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            user: glittName,
            text: glittText,
            datetime: new Date()
        })
    }
    
    fetch("http://localhost:4000/glitts", fetchConfig)
        .then(res => {
            if (res.status === 201) {
                UIkit.notification({
                    message: "Glitt created!",
                    status: "success",
                    pos: "bottom-center",
                    timeout: 3_000
                });
                resetForm()
                getGlittsFromBackend()
                hideModal()
            }
        })
}

/// MAIN
getGlittsFromBackend()