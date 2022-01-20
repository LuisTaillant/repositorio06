
document.addEventListener('DOMContentLoaded', () => {
    // Variables
    const baseDeDatos = [
        {
            id: 1,
            nombre: 'Laptop',
            precio: 480,
            imagen: './img/product01.png'
        },
        {
            id: 2,
            nombre: 'Auriculares',
            precio: 100,
            imagen: './img/product02.png'
        },
        {
            id: 3,
            nombre: 'Laptop HP',
            precio: 450,
            imagen: './img/product03.png'
        },
        {
            id: 4,
            nombre: 'PC Desktop',
            precio: 780,
            imagen: './img/product04.png'
        },
        {
            id: 5,
            nombre: 'Auriculares Gamer',
            precio: 480,
            imagen: './img/product05.png'
        }

    ];
  
    /* Métodos generales que vamos a usar en todos lados */
    // class Helper {
    //     //Hace una petición al json y nos devuelve el array
    //     static async obtenerProductos(callback) {
    //         fetch('../data.json')
    //         .then(response => response.json())
    //         //  .then(json => json)
    //         .then(callback);
    //     }
    // }

    // Helper.obtenerProductos(renderizarProductos);


    let carrito = [];
    const divisa = '$';
    const DOMitems = document.querySelector('#products');
    const DOMcarrito = document.querySelector('#carrito');
    const DOMtotal = document.querySelector('#total');
    const DOMbotonVaciar = document.querySelector('#boton-vaciar');
    const miLocalStorage = window.localStorage;



    // Funciones

    /**
    * Renderiza todos los productos a partir de la base de datos. 
    */
    function renderizarProductos() {
        baseDeDatos.forEach((info) => {
                        
            // Product
            const miNodoProduct = document.createElement('div');
            miNodoProduct.classList.add('product');

            // Imagen
            const miNodoProductImg = document.createElement('div');
            miNodoProductImg.classList.add('product-img');
            const miNodoImagen = document.createElement('img');
            miNodoImagen.setAttribute('src', info.imagen);

            // Body
            const miNodoProductBody = document.createElement('div');
            miNodoProductBody.classList.add('product-body');

            // Categoria
            const miNodoCategoria = document.createElement('p');
            miNodoCategoria.classList.add('product-category');
            miNodoCategoria.textContent = 'Category';

            // Titulo
            const miNodoTitle = document.createElement('h3');
            miNodoTitle.classList.add('product-name');
            miNodoTitle.innerHTML = `<a href="#">${info.nombre}</a>`;

            // Precio
            const miNodoPrecio = document.createElement('h4');
            miNodoPrecio.classList.add('product-price');
            miNodoPrecio.textContent = `${info.precio}${divisa}`;

            // Boton 
            const miNodoBotonDiv = document.createElement('div');
            miNodoBotonDiv.classList.add('add-to-cart');
            const miNodoBoton = document.createElement('button');
            miNodoBoton.classList.add('add-to-cart-btn');
            miNodoBoton.innerHTML = '<i class="fa fa-shopping-cart"></i> add to cart';
            miNodoBoton.setAttribute('marcador', info.id);
            miNodoBoton.addEventListener('click', anyadirProductoAlCarrito);
            
            // Insertamos
            miNodoProductBody.appendChild(miNodoCategoria);
            miNodoProductBody.appendChild(miNodoTitle);
            miNodoProductBody.appendChild(miNodoPrecio);

            miNodoBotonDiv.appendChild(miNodoBoton);

            miNodoProductImg.appendChild(miNodoImagen);

            miNodoProduct.appendChild(miNodoProductImg);
            miNodoProduct.appendChild(miNodoProductBody);
            miNodoProduct.appendChild(miNodoBotonDiv);
            
            DOMitems.appendChild(miNodoProduct);
        });
    }

    

    /**
    * Evento para añadir un producto al carrito de la compra
    */
    function anyadirProductoAlCarrito(evento) {
        // Anyadimos el Nodo a nuestro carrito
        carrito.push(evento.target.getAttribute('marcador'))
        // Actualizamos el carrito 
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();

    }

    /**
    * Renderiza todos los productos guardados en el carrito
    */
    function renderizarCarrito() {
        // Vaciamos todo el html
        DOMcarrito.textContent = '';
        // Quitamos los duplicados
        const carritoSinDuplicados = [...new Set(carrito)];
        // Generamos los Nodos a partir de carrito
        carritoSinDuplicados.forEach((item) => {
            // Obtenemos el item que necesitamos de la variable base de datos
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                // ¿Coincide las id? Solo puede existir un caso
                return itemBaseDatos.id === parseInt(item);
            });
            // Cuenta el número de veces que se repite el producto
            const numeroUnidadesItem = carrito.reduce((total, itemId) => {
                // ¿Coincide las id? Incremento el contador, en caso contrario no mantengo
                return itemId === item ? total += 1 : total;
            }, 0);
            // Creamos el nodo del item del carrito
            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-center', 'mx-2');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].nombre} - ${miItem[0].precio}${divisa}`;
            // Boton de borrar
            const miBoton = document.createElement('button');
            miBoton.classList.add('btn', 'btn-danger', 'mx-5');
            miBoton.textContent = 'X';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);
            // Mezclamos nodos
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo);
        });
       // Renderizamos el precio total en el HTML
       DOMtotal.textContent = calcularTotal();
    }

    /**
    * Evento para borrar un elemento del carrito
    */
    function borrarItemCarrito(evento) {
        // Obtenemos el producto ID que hay en el boton pulsado
        const id = evento.target.dataset.item;
        // Borramos todos los productos
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        // volvemos a renderizar
        renderizarCarrito();
        // Actualizamos el LocalStorage
        guardarCarritoEnLocalStorage();
    }

    /**
     * Calcula el precio total teniendo en cuenta los productos repetidos
     */
    function calcularTotal() {
        // Recorremos el array del carrito 
        return carrito.reduce((total, item) => {
            // De cada elemento obtenemos su precio
            const miItem = baseDeDatos.filter((itemBaseDatos) => {
                return itemBaseDatos.id === parseInt(item);
            });
            // Los sumamos al total
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    /**
    * Varia el carrito y vuelve a renderizarlo
    */
    function vaciarCarrito() {
        // Limpiamos los productos guardados
        carrito = [];
        // Renderizamos los cambios
        renderizarCarrito();
        // Borra LocalStorage
        localStorage.clear();
    }

    function guardarCarritoEnLocalStorage () {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage () {
        // ¿Existe un carrito previo guardado en LocalStorage?
        if (miLocalStorage.getItem('carrito') !== null) {
        // Carga la información
        carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);

    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
  });