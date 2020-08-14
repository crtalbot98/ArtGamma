export const sendDataToServer = (drawingName, dataURL) => {

    //get user id later.
    const imgData = new FormData();
    let imgObj = {};

    dataURL = dataURL.replace("data:image/png;base64,", "");

    imgData.append('name', drawingName);
    imgData.append('data', dataURL);

    for (let key of imgData.entries()) {
        imgObj[key[0]] = key[1]
	}

    fetch(`https://cit-41200-final-project-272919.uc.r.appspot.com/get-drawings/`,
    {
        body: JSON.stringify(imgObj),
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        console.log(res);
    });
}