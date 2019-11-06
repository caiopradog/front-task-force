<template>
  <div class="sidebar">
    <ul class="menu">
      <li class="menu-item" v-on:click="goToPage('tasks')" :class="{'active': currentRoute.name === 'tasks'}">
        <span class="menu-name">
          Tarefas
        </span>
        <span class="menu-icon">
          <fa icon="list"></fa>
        </span>
      </li>
      <li class="menu-item" v-on:click="goToPage('calendar')" :class="{'active': currentRoute.name === 'calendar'}">
        <span class="menu-name">
          Calendário de Tarefas
        </span>
        <span class="menu-icon">
          <fa icon="calendar"></fa>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
    export default {
        name: 'Sidebar',
        computed: {
            currentRoute: function () {
                return this.$route;
            }
        },
        methods: {
            goToPage: function (page) {
                this.$store.state.loading = true;
                this.$router.push(page);
            }
        }
    }
</script>
