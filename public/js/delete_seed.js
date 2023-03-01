const deleteSeedForm = document.getElementById('delete-seed-form');

deleteSeedForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const seedId = document.getElementById('seed-to-delete');
    const seedIdValue = parseInt(seedId.value);

    const seedData = {
        seedId: seedIdValue
    }

    const deleteSeed = async () => {
        const response = await fetch("/delete-seed", {
            method: "DELETE",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(seedData)
        });
        const data = await response.json();
    };

    deleteSeed();
    // const xhttp = new XMLHttpRequest();
    // xhttp.open("DELETE", "/delete-seed", true);
    // xhttp.setRequestHeader("Content-type", "application/json");
    // xhttp.send(JSON.stringify(data));

    // figure out how to get page to reload
})