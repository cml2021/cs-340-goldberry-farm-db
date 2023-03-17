// This module is adapted from the NodeJS Starter App code. Date: 3/9/2023. Source: https://github.com/osu-cs340-ecampus/nodejs-starter-app
const deleteCropForm = document.getElementById('delete-crop-form');

deleteCropForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const cropId = document.getElementById('crop-to-delete');
    const cropIdValue = parseInt(cropId.value);

    const cropData = {
        cropId: cropIdValue
    }

    const deleteCrop = async () => {
        const response = await fetch("/delete-crop", {
            method: "DELETE",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(cropData)
        });
        if (response.status == 204) {
            window.location.reload();
        } else {
            console.log(response.status);
        }
    };

    deleteCrop();
});