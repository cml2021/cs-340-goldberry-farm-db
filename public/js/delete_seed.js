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
        if (response.status == 204) {
            window.location.reload();
        } else {
            console.log(response.status);
        }
    };

    deleteSeed();
});