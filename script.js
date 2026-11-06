
// INSERT PRODUCT
const insertForm = document.getElementById("insertForm");

if (insertForm) {
    insertForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const product = {
            product_name: document.getElementById("product_name").value,
            category: document.getElementById("category").value,
            price: document.getElementById("price").value,
            quantity: document.getElementById("quantity").value,
            reorder_level: document.getElementById("reorder_level").value
        };

        try {
            const response = await fetch("/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product)
            });

            const result = await response.json();
            alert(result.message || result.error);

            if (response.ok) insertForm.reset();

        } catch (error) {
            alert("Error inserting product");
        }
    });
}


// LIST PRODUCTS
const productList = document.getElementById("productList");

if (productList) {
    async function loadProducts() {
        try {
            const response = await fetch("/products");
            const products = await response.json();

            if (!response.ok) {
                throw new Error("Unable to load products");
            }

            productList.innerHTML = "";

            products.forEach(product => {
                const row = document.createElement("tr");

                [
                    product.product_id,
                    product.product_name,
                    product.category,
                    product.price,
                    product.quantity,
                    product.reorder_level
                ].forEach(value => {
                    const cell = document.createElement("td");
                    cell.textContent = value;
                    row.appendChild(cell);
                });

                productList.appendChild(row);
            });

        } catch (error) {
            alert("Error loading products");
        }
    }

    loadProducts();
}


// UPDATE PRODUCT
const updateForm = document.getElementById("updateForm");

if (updateForm) {
    updateForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const id = document.getElementById("product_id").value;

        const product = {
            product_name: document.getElementById("product_name").value,
            category: document.getElementById("category").value,
            price: document.getElementById("price").value,
            quantity: document.getElementById("quantity").value,
            reorder_level: document.getElementById("reorder_level").value
        };

        try {
            const response = await fetch(`/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(product)
            });

            const result = await response.json();
            alert(result.message || result.error);

            if (response.ok) updateForm.reset();

        } catch (error) {
            alert("Error updating product");
        }
    });
}


// DELETE PRODUCT
const deleteForm = document.getElementById("deleteForm");

if (deleteForm) {
    deleteForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const id = document.getElementById("product_id").value;

        if (!confirm("Are you sure you want to delete this product?")) {
            return;
        }

        try {
            const response = await fetch(`/products/${id}`, {
                method: "DELETE"
            });

            const result = await response.json();
            alert(result.message || result.error);

            if (response.ok) deleteForm.reset();

        } catch (error) {
            alert("Error deleting product");
        }
    });
}
