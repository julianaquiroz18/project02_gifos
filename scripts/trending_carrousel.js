/**
 * @method cardMarkup
 * @description Card marking method
 * @returns {}
 */

const cardMarkup = ((img) => {
    return (
        `<div class="gifos-container-card trending-card">
            <img class="gifos-container-card__img" src=${img} alt="Gifo">
            <div class="overlay">
                <div class="gifos-container-card__buttons">
                    <button class="card-button" type="button"><i class="icon-icon-fav-hover"></i></button>
                    <button class="card-button" type="button"><i class="icon-icon-download"></i></button>
                    <button class="card-button" type="button"><i class="icon-icon-max"></i></button>
                </div>
            <div class="gifos-container-card__info">
                <p class="card__user">User</p>
                <p class="card__title">Titulo GIFO</p>
            </div>
        </div>
    </div>`
    );
});