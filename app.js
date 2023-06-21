let pos = 0;
let id;
let activeId;
if (localStorage.getItem("id") == null || undefined) {
  id = 0;
} else {
  id = JSON.parse(localStorage.getItem("id"));
}
let todos;
if (localStorage.getItem("todos") == null || undefined) {
  todos = [];
} else {
  todos = JSON.parse(localStorage.getItem("todos"));
}

class InputManager {
  constructor() {
    this.todoInputDescription = document.getElementById("inputfield");
    this.addButton = document.getElementById("add-button");
    this.init();
  }
  init() {
    this.todoInputDescription.addEventListener("keypress", (e) => {
      if (e.code == "Enter") {
        this.addTodo();
      }
    });
    this.addButton.addEventListener("click", () => {
      this.addTodo();
    });
  }
  
  addTodo() {
    if (this.validateInput(this.todoInputDescription.value)) {
      let newTodo = new Todo(this.todoInputDescription.value);
      this.todoInputDescription.value = "";
      todos.push(newTodo);
      localStorage.setItem("todos", JSON.stringify(todos));

      console.log(todos);
    } else {
      DialogueSystem.displayDialogueBox(
        "Input Error",
        "Input can not be empty",
        false,
        true,
        "INPUT_ERROR"
      );
    }
  }

  validateInput(input) {
    if (input === "") {
      return false;
    } else if (input.length < 5) {
      return false;
    } else {
      return true;
    }
  }
}

class Todo {
  // TODO OBJECT PROPERTIES
  constructor(description) {
    this.description = description;
    this.complete = false;
    this.id = id;
    id++;
    localStorage.setItem("id", JSON.stringify(id));

    Todo.createtodoItemElement(this);
  }

  //CREAT TODO UI ELEMENTS AND PUT ON THE LOCAL STORAGE

  static createtodoItemElement(todo) {
    const todoItem = document.createElement("div");
    todoItem.className = "todo-item";
    todoItem.id = `todo-item-${todo.id}`;

    const todoDescription = document.createElement("div");
    todoDescription.className = "todo-description";
    if (todo.complete) {
      todoDescription.classList.add("completed");
    }
    todoDescription.id = `todo-description-${todo.id}`;
    todoDescription.innerHTML = todo.description;

    const todoAction = document.createElement("div");
    todoAction.className = "todo-action";
    todoAction.id = `todo-action-${todo.id}`;

    const completeButton = document.createElement("button");
    completeButton.className = "complete";
    completeButton.id = `complete-${todo.id}`;
    completeButton.innerHTML = "Complete";
    completeButton.addEventListener("click", () => Todo.completeTodo(todo.id));

    const editButton = document.createElement("button");
    editButton.className = "edit";
    editButton.id = `edit-${todo.id}`;
    editButton.innerHTML = "Edit";
    editButton.addEventListener("click", () => {
      activeId = todo.id;
      DialogueSystem.displayEditBox(todo.description);
    });

    const removeButton = document.createElement("button");
    removeButton.className = "remove";
    removeButton.id = `remove-${todo.id}`;
    removeButton.innerHTML = "Remove";
    removeButton.addEventListener("click", () => {
      activeId = todo.id;
      DialogueSystem.displayDialogueBox(
        "Delete Button clicked",
        "Are you sure you want to delete this todo?",
        true,
        true,
        "DELETE_TODO"
      );
    });

    todoAction.appendChild(completeButton);
    todoAction.appendChild(editButton);
    todoAction.appendChild(removeButton);

    todoItem.appendChild(todoDescription);
    todoItem.appendChild(todoAction);

    document
      .getElementById("todo-item-container")
      .insertBefore(
        todoItem,
        document.getElementById("todo-item-container").firstChild
      );
  }
  //COMPLETE STATUS FUNCTION
  static completeTodo(id) {
    todos.forEach((todo) => {
      if (todo.id === id) {
        todo.complete = !todo.complete;
      }
    });
    localStorage.setItem("todos", JSON.stringify(todos));

    document
      .getElementById(`todo-description-${id}`)
      .classList.toggle("completed");
  }
  //REMOVE BUTTON FUNCTION
  static removeTodo(id) {
    todos.forEach((todo, index) => {
      if (todo.id === id) {
        todos.splice(index, 1);
      }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
    document.getElementById(`todo-item-${id}`).remove();
    DialogueSystem.closeDialogueBox();
    console.log("1");
  }
  //EDIT BUTTON FUNCTION
  static saveEditedTodo(id) {
    document.getElementById(`todo-description-${id}`).innerText =
      editInput.value;
    DialogueSystem.closeEditBox();
  }
  // DELETE ANIMATION FUNCTION
  static deleteAnimation(id) {
    pos += 5;

    if (pos < 920) {
      document.getElementById(
        `todo-item-${id}`
      ).style.transform = `translateX(${pos}px)`;

      setTimeout(
        requestAnimationFrame(() => Todo.deleteAnimation(id)),
        1000 / 100
      );

      console.log(pos);
    } else if (pos === 920) {
      Todo.removeTodo(id);
      pos = 0;
      return;
    }
  }
}

let MODE = "";
let ACTIVE_MODE = "";
const mainContainer = document.getElementById("main-container");
const dialogueBox = document.getElementById("dialogue");
const closeButton = document.getElementById("close");
const dialogueTitle = document.getElementById("title");
const dialogueBody = document.getElementById("body");
const cancelButton = document.getElementById("cancel");
const acceptButton = document.getElementById("accept");
const background = document.getElementById("background");
const editBox = document.getElementById("edit-box");
const editCloseButton = document.getElementById("edit-close-button");
const editInput = document.getElementById("edit-input");
const saveButton = document.getElementById("save-button");

background.addEventListener("click", () => {
  {
    if (ACTIVE_MODE === "DELETE") {
      DialogueSystem.closeDialogueBox();
    } else if (ACTIVE_MODE === "EDIT") {
      DialogueSystem.closeEditBox();
    } else {
      return;
    }
    mainContainer.style.zIndex = "10";
    background.style.zIndex = "5";
    editBox.style.zIndex = "0";
  }
});
saveButton.addEventListener("click", () => {
  Todo.saveEditedTodo(activeId);
});
editCloseButton.addEventListener("click", () => {
  DialogueSystem.closeEditBox();
});
acceptButton.addEventListener("click", () => {
  if (MODE === "DELETE_TODO") {
    //calls remove todo function
    DialogueSystem.closeDialogueBox();
    Todo.deleteAnimation(activeId);
  } else if (MODE === "INPUT_ERROR") {
    // calls closedialogue function
    DialogueSystem.closeDialogueBox();
  }
});
cancelButton.addEventListener("click", () => {
  DialogueSystem.closeDialogueBox();
});
closeButton.addEventListener("click", () => {
  DialogueSystem.closeDialogueBox();
});

class DialogueSystem {
  static displayDialogueBox(title, body, cancel_visible, accept_visible, mode) {
    MODE = mode;
    ACTIVE_MODE = "DELETE";
    dialogueTitle.innerText = title;
    dialogueBody.innerText = body;

    cancel_visible
      ? (cancelButton.style.display = "flex")
      : (cancelButton.style.display = "none");
    accept_visible
      ? (acceptButton.style.display = "flex")
      : (acceptButton.style.display = "none");

    dialogueBox.style.display = "flex";
    mainContainer.style.opacity = "0.2";
    mainContainer.style.zIndex = "0";
    background.style.zIndex = "5";
    dialogueBox.style.zIndex = "10";
  }
  static closeDialogueBox() {
    dialogueBox.style.display = "none";
    mainContainer.style.opacity = "1";
  }

  static displayEditBox(description) {
    ACTIVE_MODE = "EDIT";
    editBox.style.display = "flex";
    editInput.value = description;
    editInput.focus();
    mainContainer.style.opacity = "0.2";
    mainContainer.style.zIndex = "0";
    background.style.zIndex = "5";
    editBox.style.zIndex = "10";
  }

  static closeEditBox() {
    editBox.style.display = "none";
    mainContainer.style.opacity = "1";
  }
}

//########## APP SATRTS HERE  #############
const newInput = new InputManager;
todos.forEach((todo) => {
  Todo.createtodoItemElement(todo);
});


