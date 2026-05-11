
const menu = document.getElementById('menu');
const cartBtn = document.getElementById('cart-btn')
const cartModal = document.getElementById('cart-modal')
const cartItemsContainer = document.getElementById('cart-items')
const cartTotal = document.getElementById('cart-total')
const checkoutBtn = document.getElementById('checkout-btn')
const closeModalBtn = document.getElementById('close-modal-btn')
const cartCounter = document.getElementById('cart-count')
const addressWarn = document.getElementById('address-warn')

let cart = [];


//Dados de endereço:
 const rua =     document.getElementById('rua')
 const bairro =  document.getElementById('bairro')
 const cidade =  document.getElementById('cidade')
 const uf =      document.getElementById('uf')
 const numero =  document.getElementById('numero')


 //Dados de pagamento

const radios = document.querySelectorAll('input[name="pagamento"]')
const trocoDiv = document.getElementById("trocoDiv")
const paymentWarn = document.getElementById("payment-warn")

const pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked')





//Abrir o modal do carrinho
cartBtn.addEventListener('click', function(){
    updateCartModal();
    cartModal.style.display = 'flex';
})

//Fechar o modal quando clicar fora
cartModal.addEventListener('click', function(event){
    if(event.target === cartModal){
        cartModal.style.display = 'none'
    }
})

closeModalBtn.addEventListener('click', function(){
    cartModal.style.display = 'none'
})

menu.addEventListener('click', function(event){  
   // console.log(event.target)

 let parentButton = event.target.closest('.add-to-cart-btn') //devolve o elemento com classe 'add-to-cart-btn' ou algum children desse elemento

  if(parentButton){
     const name = parentButton.getAttribute('data-name')
     const price = parseFloat(parentButton.getAttribute('data-price'))
     addToCart(name, price)

  }

})


//Função para adicionar no carrinho
function addToCart(name, price){

   const existingItem = cart.find(item => item.name === name)

   if(existingItem){   //Se o item já existem, aumenta apenas a quantity + 1
     
    existingItem.quantity += 1;
    
   }else{
   cart.push({
    name,
    price,
    quantity: 1 
   })
}

 updateCartModal()
   
}

//Atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div")
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p> 
            </div>
     
           <button class="remove-from-cart-btn cursor-pointer" data-name="${item.name}">Remover</button> 
              
        </div>
        `

       total+= item.price * item.quantity;

       cartItemsContainer.appendChild(cartItemElement)
     
    })

    cartTotal.textContent = total.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
    cartCounter.innerHTML = cart.length;
}


//Função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        removeItemCart(name)
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index]
        
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal()
            return;
        }

        cart.splice(index,1)
        updateCartModal()
    }
}
/*
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ''){
        addressInput.classList.remove('border-red-500')
        addressWarn.classList.add('hidden')
    }

})
    */


rua.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ''){
        rua.classList.remove('border-red-500')
        addressWarn.classList.add('hidden')
    }

})


bairro.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ''){
        bairro.classList.remove('border-red-500')
        addressWarn.classList.add('hidden')
    }

})


cidade.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ''){
        cidade.classList.remove('border-red-500')
        addressWarn.classList.add('hidden')
    }

})


uf.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ''){
        uf.classList.remove('border-red-500')
        addressWarn.classList.add('hidden')
    }

})


numero.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ''){
        numero.classList.remove('border-red-500')
        addressWarn.classList.add('hidden')
    }

})



//Finalizar pedido
checkoutBtn.addEventListener("click", function(){
    
    const isOpen = checkLojaOpen();

  if(!isOpen){
    Toastify({
    text: "Ops, a loja está fechada!",
    duration: 3000,
    close: true,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    style: {
      background: "#ef4444"
    }
  }).showToast();

    return;
    }


  

    if(cart.length === 0) return;

    if(rua.value === '' || bairro.value === '' || cidade.value === '' || uf.value === '' || numero.value === ''){
        addressWarn.classList.remove("hidden")
       // addressInput.classList.add('border-red-500')
        return;
    }

    //Enviar o pedido para a API do Whatsapp
    const cartItems = cart.map((item) => {
        return(
            `${item.name}  Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(2)} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = '98982675733'

    let endereco = `Endereço: (rua: ${rua.value} | bairro: ${bairro.value} | cidade: ${cidade.value} | UF: ${uf.value} | numero: ${numero.value})`

    window.open(`https://wa.me/${phone}?text=${message} ${endereco} | Total Pedido: ${cartTotal.textContent} 
               `, "_blank")

    cart = []
    updateCartModal()

})


//Verificar a hora e manipular o card do horário
function checkLojaOpen(){
    const data = new Date()
    const hora = data.getHours()
    return hora >= 9 && hora <= 16  //true = loja aberto
}

const spanItem = document.getElementById('date-span');
const isOpen = checkLojaOpen()

if(isOpen){
    spanItem.classList.remove('bg-red-500')
    spanItem.classList.add('bg-green-600')
}else{
    spanItem.classList.remove('bg-green-600')
    spanItem.classList.add('bg-red-500')
}




function limpa_formulário_cep() {
            //Limpa valores do formulário de cep.
            rua.value = ''
            bairro.value = ''
            cidade.value = ''
            uf.value = ''
            numero.value = ''
    }

    function meu_callback(conteudo) {
        if (!("erro" in conteudo)) {
            //Atualiza os campos com os valores.
            rua.value=(conteudo.logradouro);
            bairro.value=(conteudo.bairro);
            cidade.value=(conteudo.localidade);
            uf.value=(conteudo.uf);
           // numero.value=(conteudo.numero);
        } //end if.
        else {
            //CEP não Encontrado.
            limpa_formulário_cep();
            alert("CEP não encontrado.");
        }
    }
        
    function pesquisacep(valor) {

        //Nova variável "cep" somente com dígitos.
        var cep = valor.replace(/\D/g, '');

        //Verifica se campo cep possui valor informado.
        if (cep != "") {

            //Expressão regular para validar o CEP.
            var validacep = /^[0-9]{8}$/;

            //Valida o formato do CEP.
            if(validacep.test(cep)) {

                //Preenche os campos com "..." enquanto consulta webservice.
                rua.value="...";
                bairro.value="...";
                cidade.value="...";
                uf.value="...";

                //Cria um elemento javascript.
                var script = document.createElement('script');

                //Sincroniza com o callback.
                script.src = 'https://viacep.com.br/ws/'+ cep + '/json/?callback=meu_callback';

                //Insere script no documento e carrega o conteúdo.
                document.body.appendChild(script);

            } //end if.
            else {
                //cep é inválido.
                limpa_formulário_cep();
                alert("Formato de CEP inválido.");
            }
        } //end if.
        else {
            //cep sem valor, limpa formulário.
            limpa_formulário_cep();
        }
    };


