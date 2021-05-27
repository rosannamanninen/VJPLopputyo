function fetchData(vuosi = 0, artikkeli = "", kommentti = "") {
    fetch("./data.json").then(response => {
        return response.json();
    })
    .then((data) =>  {
        if (vuosi === 0 && artikkeli === "" && kommentti == "") {
            renderYear(data.artikkelit);
        // get articles corresponding to selected year and render to UI
        } else if (vuosi != 0 && artikkeli === "") {
            renderYear(data.artikkelit);
            let newArticles = [];
            let selectedItem = document.getElementById(vuosi);
            for (let i = 0; i < data.artikkelit.length; i++) {
                if (data.artikkelit[i]["year"] == vuosi) {
                    newArticles.push(data.artikkelit[i]);
                }
            }
            let str = `<ul>`;
            newArticles.forEach(function(artikkeli) {
                str += `<li id="${artikkeli.articleName},${artikkeli.date}" class="artikkeli" onclick="articleDisplay(this.id)">${artikkeli.articleName} | ${parseDate(artikkeli.date)}</li>`;
            });
            str += `</ul>`;
            selectedItem.innerHTML = str;
        // get the article that matches the clicked article name
        } else if (vuosi == null && artikkeli !== "" && kommentti == "") {
            let teksti = "";
            let [x, y] = [artikkeli.split(",")[0], artikkeli.split(",")[1]];
            for (let i = 0; i < data.artikkelit.length; i++) {
                if (data.artikkelit[i]["articleName"] == x) {
                    teksti = data.artikkelit[i]["articleContent"];
                    document.getElementById("otsikko").innerHTML = data.artikkelit[i].articleName;
                    document.getElementById("alkusanat").innerHTML = '';
                    document.getElementById("komotsikko").innerHTML = 'Kommentit';
                }
            }
            // render article content and comment textbox and submit button
            str = `<p>${teksti}</p>`;
            let kommenttiField = `<textarea name="comments" class = "kommenttikentta" id="${artikkeli}comment">Write your comment here!</textarea>
            <br><input id="${artikkeli}" type="submit" value="Submit" class= "napit" onclick="getInputValue(this.id);">`
            document.getElementById("IDartikkeli").innerHTML = str;
            document.getElementById("IDkommentti").innerHTML = kommenttiField;

            // render the article comments to HTML
            let rendr = `<ul>`;
            let inputValue;
            if (localStorage.getItem(`added-comment`) !== null) {
                inputValue = JSON.parse(localStorage.getItem(`added-comment`));
                for (let i = 0; i < inputValue.length; i++) {
                    if (inputValue[i]["articleDate"] == y) {
                        rendr += `<li>${inputValue[i]["comment"]} - ${calculateTime(inputValue[i]["commentDate"])}</li>`;
                    }
                }
                rendr += `<ul>`;
                document.querySelector(".kommentit").innerHTML = rendr;
                console.log(calculateTime(inputValue[0]["commentDate"]));
            }
        }
    });
}
fetchData();
function articleSearch(clicked_id) {
    fetchData(clicked_id);
}
function articleDisplay(clicked_article) {
    fetchData(null, clicked_article);
}
// take the comment and pass it to function that sends it to local storage
function getInputValue(art) {
    let [x, y] = [art.split(",")[0], art.split(",")[1]];
    let inputVal = document.getElementById(art+"comment").value;
    let obj = new Comment(y, x, inputVal, JSON.parse(JSON.stringify(new Date())));
    let comments = GetFromLocalStorage(`added-comment`, obj);
}
// this function gets string from localStorage and converts it into JSON
function GetFromLocalStorage(key, comment) {
    let inputValue;
    if (localStorage.getItem(key) !== null) {
        inputValue = JSON.parse(localStorage.getItem(key));
    } else {
        inputValue = [];
    }
    inputValue.push(comment);
    localStorage.setItem(key, JSON.stringify(inputValue));
    return inputValue;
}
// take the JSON data and render years to HTML
function renderYear(obj) {
    let testArray = [];
    for (let i = 0; i < obj.length; i++) {
        testArray.push(obj[i].year);
    }
    const eriVuodet = [...new Set(testArray)];
    let str = `<ul>`
    eriVuodet.forEach(function(vuosi) {
        str += `<li id="${vuosi}" class="vuosi" onclick="articleSearch(this.id)">${vuosi}</li>`;
    });
    str += `</ul>`;
    document.getElementById("aikajanaLista").innerHTML = str;
}
function parseDate(x) {
    let y = new Date(x);
    return y;
}

// Object constructor for article comments
class Comment {
    constructor(articleDate, articleName, comment, commentDate) {
        this.articleDate = articleDate;
        this.articleName = articleName;
        this.comment = comment;
        this.commentDate = commentDate;
    }
}
// add time to comments
function calculateTime(dateComment) {
    let commentDate = new Date(dateComment);
    let sub = (new Date() - commentDate) / (1000 * 60 * 60);
    if (sub < 0.6) {
        return (`${Math.floor(sub * 100)} minutes ago`);
    } else if (sub > 0.6 && sub < 24 * 0.6) {
        return (`${Math.floor(sub / 0.6)} hours ago`);
    } else if (sub > 24 * 0.6 && sub < 24 * 7 * 0.6) {
        return (`${Math.floor(sub / 24 / 0.6)} days ago`);
    } else {
        return commentDate;
    }
}
