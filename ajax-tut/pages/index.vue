<template>
  <div class="container">
    <div>
      <Logo />
      <h1 class="title">ajax-tut</h1>
      {{todos}}
      <!-- <button @click="getTodos(15)">GET</button> -->

      <!-- <div class="links" for="todo in todos" :key="todo.id">{{todo.title}}</div> -->
    </div>
  </div>
</template>

<script>
export default {
asyncData() {
try {
        const noCros = "";
        //const noCros = 'https://cors-anywhere.herokuapp.com';
        const baseUrl = "https://jsonplaceholder.typicode.com/";
        const finalURL = `${noCros}${baseUrl}todos?_limit=15`;
        const result = await fetch(finalURL);
        this.todos = await result.json();

        // data.forEach(todo =>
        //   console.log(`Your todo of today is: ${todo.title}.`)
        // );
        // console.log(data);
      } catch (err) {
        console.log(err);
      }
},
data()
{
  return {
    todos: []
  }
}
}

</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
