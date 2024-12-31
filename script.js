async function fetchBooks() {
    try {
        const response = await fetch("http://localhost:5050/bookManagement/api/v1/book");
        const books = await response.json();
        generateCards(books);
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}


function generateCards(data) {
    const container = document.getElementById("cards-container");
    container.innerHTML = "";
    data.forEach(book => {

        const card = document.createElement("div");
        card.classList.add("card");


        const img = document.createElement("img");


        img.src = book.image.startsWith("data:")
            ? book.image
            : `data:image/jpeg;base64,${book.image}`;
        img.classList.add("card-img-top");
        img.alt = book.title;


        img.onerror = () => {
            img.src = "path/to/placeholder-image.jpg";
        };

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const cardTitle = document.createElement("h5");
        cardTitle.textContent = book.title;
        cardTitle.style.fontWeight = "bold";

        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = `Author: ${book.author}\nPrice: $${book.price}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("btn", "btn-danger", "mt-2");

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        card.appendChild(img);
        cardBody.appendChild(deleteButton);
        card.appendChild(cardBody);



        container.appendChild(card);
    });
}


fetchBooks();


document.getElementById('addBook').addEventListener("click",function (){
    const ISBN=document.getElementById('isbn').value;
    const title=document.getElementById('title').value;
    const author=document.getElementById('author').value;
    const image=document.getElementById('image').files[0];
    const price=document.getElementById('price').value;


    if( !ISBN || !title || !author || !image || !price ){
        alert("Please fill in all required fields ! ");
        return;
    }
    const formData = new FormData();

    formData.append("ISBN",ISBN);
    formData.append("title",title);
    formData.append("author",author);
    formData.append("image",image);
    formData.append("price",price);

    fetch("http://localhost:5050/bookManagement/api/v1/book" ,{
        method:"POST",
        body:formData,
        headers:{

        }
    })
        .then(response => {
            if (response.ok) {
                alert("book saved successfully!");

            } else {
                alert("Error saving book: " + response.statusText);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred while saving the book.");
        });
    console.log(ISBN,title,author,image,price);
    console.log(formData)



})