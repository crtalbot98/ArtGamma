

    import {imageToCanvas} from './modules/draw-styles.js';
    
    const canvas = document.querySelector('#canvas');
    const ctx = canvas.getContext("2d");
    const sideBarBtn = document.querySelector('.side-bar-btn');
    const sideBar = document.querySelector('.side-bar');
    const popUpBtn = document.querySelector('.create-btn');
    const drawingPopUp = document.querySelector('.drawing-popUp');
    const closeSideBar = document.querySelector('.close-side-bar');
    const closePopUp = document.querySelector('.close-popUp');

    popUpBtn.addEventListener('click', () => {
        drawingPopUp.classList.remove('display-none');
        drawingPopUp.classList.add('display-fixed');
    });

    closePopUp.addEventListener('click', () => {
        drawingPopUp.classList.remove('display-fixed');
        drawingPopUp.classList.add('display-none');
    });

    closeSideBar.addEventListener('click', () => {
        sideBar.classList.remove('bar-active');
        sideBar.classList.add('hide');
    });


    fetch(`https://cit-41200-final-project-272919.uc.r.appspot.com/get-drawings/`,
    {
        method: 'get',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        return res.json();
    }).then((json) => {
        console.log(json);
        appendData(json);
        return fetch(`https://cit-41200-final-project-272919.uc.r.appspot.com/user/`)
    }).then((res) => {
        return res.json();
    }).then((json) => {
        console.log(json);

        if(Object.keys(json).length <= 1){
            sideBarBtn.addEventListener('click', () => {
                location.href = `https://cit-41200-final-project-272919.uc.r.appspot.com/signin`;
            });
        }
        else{
            sideBarBtn.textContent = 'Account';
            sideBarBtn.addEventListener('click', () => {
                sideBar.classList.remove('hide');
                sideBar.classList.add('bar-active');
            });
        }
        appendUserData(json);
    }).catch((e) => {
        console.log(e);
    });


const appendUserData = (drawings) => {
    
    document.querySelector('.user-email').textContent = drawings.email;

     drawings.drawing.forEach(drawing => {
        const name = document.createElement('h4');
        const drawingImg = document.createElement('img');
        const drawingCont = document.createElement('div');
        const overlay = document.createElement('div');

        name.textContent = drawing.imgName;
        name.style.color = 'white';
        drawingImg.src = drawing.imgLink;
        drawingImg.classList.add('user-drawings');
        overlay.classList.add('user-overlay');
        drawingCont.classList.add('drawing');

        overlay.append(name);
        drawingCont.append(drawingImg);
        drawingCont.append(overlay);

        sideBar.append(drawingCont);
     });
}

const appendData = async (drawings) => {

    const drawingsCont = document.querySelector('.drawing-cont');

    drawings.forEach(drawing => {
        const name = document.createElement('h4');
        const color = document.createElement('h4');
        const foregroundColors = document.createElement('h4');
        const creator = document.createElement('h4');
        const drawingImg = document.createElement('img');
        const drawingCont = document.createElement('div');
        const overlay = document.createElement('div');
        let foregroundTxt = 'Foreground Colors: ';
        
        name.textContent = drawing.imgName;
        drawingImg.src = drawing.imgLink;
        color.textContent = `Background Color: ${drawing.imgData.colors.background_colors[0].closest_palette_color}`;

        if(drawing.email === undefined){
            creator.textContent = 'Created by Anonymous';
        }
        else{
            creator.textContent = `Created by ${drawing.email}`;
        }

        if(drawing.imgData.colors.foreground_colors.length !== 0){
            for(let i = 0; i < drawing.imgData.colors.foreground_colors.length; i++){
                if(i === drawing.imgData.colors.foreground_colors.length - 1){
                    foregroundTxt += drawing.imgData.colors.foreground_colors[i].closest_palette_color;
                }
                else{
                    foregroundTxt += drawing.imgData.colors.foreground_colors[i].closest_palette_color+', ';
                }
            }
        }
        else{
            foregroundTxt += 'None';
        }

        foregroundColors.textContent = foregroundTxt;
        drawingImg.classList.add('drawing-imgs');
        overlay.classList.add('overlay');
        drawingCont.classList.add('drawing');

        overlay.append(name);
        overlay.append(creator);
        overlay.append(color);
        overlay.append(foregroundColors);
        drawingCont.append(drawingImg);
        drawingCont.append(overlay);

        drawingsCont.append(drawingCont);
    });

    await document.querySelectorAll('.overlay').forEach((drawing) => {
        drawing.addEventListener('click', () => {
            imageToCanvas(ctx, drawing.previousElementSibling);
            drawingPopUp.classList.remove('display-none');
            drawingPopUp.classList.add('display-fixed');
        });
    });

}