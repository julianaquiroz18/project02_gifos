const input = document.querySelector(".search-bar__input");
input.addEventListener("keypress", search);

const searchIcon = document.querySelector(".search-icon");
searchIcon.addEventListener("click", search);

let inputValue = "";

function search(e) {
    if (e.keyCode === 13 || e.type === "click") {
        inputValue = input.value;
        console.log(inputValue)

    }

}