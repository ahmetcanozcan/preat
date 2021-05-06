<p align="center">
  <h3 align="center">Preat</h3>
  <p align="center">
    simple, Vue-like, reactive library created by educational purposes
  </p>
</p>

---

## Installation

using npm

```ps
npm install preat --save
```

with script tags

```html
<script src="https://unpkg.com/preat@0.1.2/dist/main.js"></script>
```

## Examples

- ### Variable Hook

```html
<p id="info"></p>
<script src="https://unpkg.com/preat@0.1.2/dist/main.js"></script>
<script>
  new preat.Variable("lorem ipsum")
    .setName("infoText")
    .hook({
      el: "#info",
      template: "MSG:{{value}}",
    })
    .seat();

  console.log(infoText); // lorem ipsum
  // whenever infoText is changed, p#info will be changed
  setTimeout(() => {
    infoText = "Changed text";
  }, 1500);
</script>
```

- ### Input binding

```html
<input type="text" id="inp" />
<p id="info"></p>
<script src="https://unpkg.com/preat@0.1.2/dist/main.js"></script>
<script>
  new preat.Variable("lorem ipsum")
    .setName("infoText")
    .hook({
      el: "#info",
      template: "MSG:{{value}}",
    })
    .bind("#inp")
    .seat();

  console.log(infoText); // lorem ipsum
  // whenever infoText is changed, p#info will be changed
  // value  of input can be accesable by infoText variable
  // and infoText can be manipulated by input#inp
</script>
```

- ### TODO List

```html
<input type="text" id="inp" />
<button onclick="todos.add()">Add</button>
<p id="info"></p>
<p id="todos"></p>
<script src="https://unpkg.com/preat@0.1.1/dist/main.js"></script>
<script>
  const template = `
<h1>{{title}}</h1>
<ul>
  {{#todos}}
    <li>{{value}} <button onclick="todos.delete({{index}})" >X</button> </li>
  {{/todos}}
 </ul>
`;
  // Original mustache syntax does not allow use
  // array indeces so this plug in allow us to
  // use element indeces as index, value pair
  preat.use(preat.plugins.ArrayIndexer);

  let todos = preat.create({
    el: "#todos",
    template,
    data: {
      title: "Todo List",
      newTodo: "New Todo",
      todos: [],
    },
    created() {
      console.log("instance created");
    },
    mounted() {
      console.log("instance mounted");
    },
    methods: {
      delete(i) {
        this.todos.splice(i, 1);
      },
      add() {
        this.todos.push(this.newTodo);
      },
    },
  });
  todos.bind("newTodo", "#inp"); // input variable binding
</script>
```
