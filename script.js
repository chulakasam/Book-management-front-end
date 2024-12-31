async function fetchBooks() {
    try {
        const response = await fetch("http://localhost:5050/bookManagement/api/v1/book");
        const books = await response.json();
        generateCards(books);
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

// -----------------------load all books ---------------------------------
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

        const cardISBN = document.createElement("h6");
        cardISBN.textContent = book.isbn;
        cardISBN.style.fontWeight = "bold";

        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.textContent = `Author: ${book.author}\nPrice: $${book.price}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("btn", "btn-danger", "mt-2");



        const searchButton = document.createElement("search-button");
        searchButton.textContent = "Search";
        searchButton.classList.add("btn", "btn-primary", "mt-2");





        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardISBN);
        card.appendChild(img);
        cardBody.appendChild(deleteButton);
        cardBody.appendChild(searchButton);
        card.appendChild(cardBody);

        deleteButton.addEventListener("click", function () {
            deleteCard(book.isbn, card); // Calling the delete function
        });

        searchButton.addEventListener("click", function () {
            searchCard(book.isbn); // Calling the update function
        });

        container.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded",fetchBooks);


// ------------------------ add book -------------------------------------------

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


// -------------------------delete book --------------------------

function deleteCard(ISBN, cardElement) {
    fetch(`http://localhost:5050/bookManagement/api/v1/book/${ISBN}`, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                console.log(`Book with ID ${ISBN} deleted successfully`);
                cardElement.remove();
            } else {
                console.error("Failed to delete the book");
            }
        })
        .catch(error => {
            console.error("Error deleting book:", error);
        });
}



// ------------------------- search book -------------------------



function searchCard(ISBN) {
    fetch(`http://localhost:5050/bookManagement/api/v1/book/${ISBN}`, {
        method: "GET"
    })

        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("Book not found.");
                }
                throw new Error("Failed to fetch Book.");
            }
            return response.json();
        })
        .then(book => {


            document.getElementById("isbn").value = book.isbn;
            document.getElementById("title").value = book.title;
            document.getElementById("author").value = book.author;
            document.getElementById("image").files[0]= book.image;
            document.getElementById("price").value = book.price;

            console.log("book details loaded successfully.");

        })
        .catch(error => {
            console.error("Error fetching field:", error);
            alert(error.message);
        });

}


document.getElementById('updateBook').addEventListener('click',function (){

})
