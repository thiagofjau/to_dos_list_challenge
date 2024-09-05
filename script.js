
/*primeiro passo, capturar o que o user digitou*/
let button = document.querySelector(".btn-add");
let input = document.querySelector(".input-task");
let fullList = document.querySelector(".list-task"); //vai usar um innerHTML após o forEACH

/**terceiro passo, criar o array para receber as tasks */
let myTasks = [];

let editingTaskIndex = null; //var para editar

/**quarto passo, criar minhaFuncao, meuArray.push colocar o conteúdo digitado no array com param input.value que é o valor digitado no input */
function addNewTask() {

    // Verificar se o campo de entrada está vazio
    if (input.value.trim() === "") { //compara se está vazio e se espaço, trim tira o espaço ficando vazio
        Swal.fire({ //Alert do sweetAlert textos chamam aqui
            text: "Please, type a task! :)",
            confirmButtonText: 'OK',
        }
    )
    
        return; // Retorna para evitar adicionar uma tarefa vazia à lista
    }
    
    if (editingTaskIndex !== null) { // Verifica se estamos editando uma tarefa
        myTasks[editingTaskIndex].toDo = input.value; // Atualiza a tarefa no array
        editingTaskIndex = null; // Reseta o índice de edição após salvar
        button.innerHTML = "Add"; // Volta o botão para "Add Task"
        input.style.backgroundColor = "white"; //redefine cor do bg color do input
        input.style.color = "black"; //muda font color do input
        button.style.backgroundColor = "#3b8e7d"; // muda bg color do button"
    } else {

        // myTasks.push(input.value); para FINALIZAR TAREFA, CONSTROI OBJ ABAIXO
        myTasks.push({ //cria objeto toDo(tarefa recebe input.value) e (done começa em não feito ou seja, false)
            //porém agora a tarefa não chega pronta, chega o OBJ
            toDo: input.value,
            done: false,
            createdAt: Date.now()  // Adiciona um timestamp à tarefa, para ordenação por ordem de criação

        });
    }
    //limpar input depois de add
    input.value = "";

    //chama funcao mostrar tarefas
    showTasks();

}

/**segundo passo, "ouvir"Quando clicarem e o param click, minhaFuncao */
button.addEventListener("click", addNewTask) /*quando ouvir/click ele chama funcao, em vez de jogar lá no html o onclick, ele pega o valor do input e push no array*/

/*MOSTRAR TAREFAS*/

// passo 1
function showTasks() {
    // passo 1: //montar html aqui para mandar pra lá, copia o li do html e cola abaixo comentado e continua no js
    let newLi = "" //passo 2 inicia ele vazia

    myTasks.sort((a, b) => {
        if (a.done === b.done) {
            return a.createdAt - b.createdAt; // Mantém a ordem de criação se o estado "done" for o mesmo
        }
        return a.done - b.done; // Ordena por "done" (false primeiro, true depois)
    });

    //passo 3 pegar todos os itens do array usando forEach
    //posicao (pos) p/ saber qual deletar
    myTasks.forEach((task, pos) => {
        //4 passo, chama var newLi de nova lista recebe por crases e cola o html dentro das CRASES, interpolou senão seria newLi = newLi + `..`
        //task.done é um if, se task.done for verdadeiro adiciona a classe "done" 

        const checkboxImg = task.done ? "./img/bx-checkbox-checked.png" : "./img/bx-checkbox.png";
        newLi = `${newLi}
        <li class="task ${task.done && "done"}">
            <img src="${checkboxImg}" class="check-icon" alt="todo's check" onclick="doneTask(${pos})" />
            <p>${task.toDo}</p> 
            <div class="edit-trash">
                <img src="./img/edit-alt-regular-24.png" alt="edit" onclick="editTask(${pos})" />
                <img src="./img/trash-alt-regular-24.png" alt="delete" onclick="deleteTask(${pos})" />
            </div>
            
        </li>
        `
        // chama var index com ${index} para saber a posicao que vai deletar
        //5 passo, quero colocar o conteúdo da tarefa var TASK dentro do forEach dentro do <p>, usando ${var} que funciona interpolado

        // EXPLICACAO: de onde vem o texto? clicou no btn, chamou a funcao addNewTask, essa funcao pegou o que tava em push(input.value)
        //e guardou dentro do array myTasks. Após isso ele chama a funcao showTasks dentro do addNewTask, o showTasks vai pegar o array myTasks com
        //o forEach que vai pegar o texto dentro do array e colocar em na var task do forEach e aí ele finalmente coloca no <p>. Porém 
        //ele iria SOBREPOR o texto anterior, o que fazer? Acumular: newLi = newLi + (se possível, interpolar).
        // Após essa acumulação, precisamos injetar essas newLi lá no HTML, apaga o <li> lá do html

        //passo 6:  pega class de <ul> e mapeia lá emcima nas vars
    })

    //ainda dentro da funcao showTask fora do forEACH injetar com innerHTML
    fullList.innerHTML = newLi;

    //save local item só aceita string, então precisa do JSON.stringfy pra converter em string
    localStorage.setItem("list", JSON.stringify(myTasks));
    //após isso criar funcao reloadItems para puxar os dados de volta

}


//DELETAR TASKS
async function deleteTask(pos) { //funcao async para poder usar o sweet alert, pq retorna uma promise, aguarda ação do user para executar

    const result = await Swal.fire({ //atribundo sweet alert à var result 
        title: "Delete task!",
        text: "Are you sure?",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#000000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Delete",
    })

    if (result.isConfirmed) { //chamando result e o .isConfirmed é um atributo do JS que confirma ou não uma ação enquanto aguarda promise
        //array.splice <- é uma funcaopara deletar array, falo 2 coisas, 
        //qual pos do array e segundo é qnts itens a partir dessa pos
        myTasks.splice(pos, 1) //ou seja, quem eu quero deletar 'pos' e quantos itens quero deletar '1'.
        //após isso preciso que ele vai no array alterado e rebuild tudo de novo atualizado

        showTasks();

        console.log(pos); //joga essa funcao no onclick do img trash
    }

}


//DONE TASKS. Após concluída, trocar o o obj done para TRUE
function doneTask(pos) {
    //pega lista de itens que é o array obj
    myTasks[pos].done = !myTasks[pos].done  //chama o array, pos, done(concluída) recebe ele mesmo com o !negacao

    showTasks(); //chama de novo pra atualizar a lista
}

//EDIT TASK (TA SALVANDO DUAS VEZES, CORRIGIRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR)
//EDIT TASK (TA SALVANDO DUAS VEZES, CORRIGIRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR)
//EDIT TASK (TA SALVANDO DUAS VEZES, CORRIGIRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR)
//EDIT TASK (TA SALVANDO DUAS VEZES, CORRIGIRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR)
//EDIT TASK (TA SALVANDO DUAS VEZES, CORRIGIRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR)
//EDIT TASK (TA SALVANDO DUAS VEZES, CORRIGIRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR)
function editTask(pos) {
    input.value = myTasks[pos].toDo; // Preenche o input com a tarefa selecionada para edição
    editingTaskIndex = pos; // Armazena o índice da tarefa sendo editada
    input.focus();
    button.innerHTML = "Save"; // Altera o botão para "Save"    
    button.style.backgroundColor = "grey"; // muda bg color do button"
}

function reloadItems() {
    let localStorageTasks = localStorage.getItem("list");
    //array recebe o que foi salvo local, mas tem que reconverter, pq stringfy, aí precisa desfazer a string para OBJETO...
    //porém pra evitar erro ao carregar vazio, checar, se localstoragetasks true, executar  trazendo a lista, se não, não fazer nada
    if (localStorageTasks) {
        myTasks = JSON.parse(localStorageTasks);
    }

    //após reconverter pra objeto, chama o showTasks()

    //até aqui ele só chama no console, aí precisa remontar na tela, chamar função aqui acima^
    // console.log(localStorageTasks);

    showTasks();

}

reloadItems();