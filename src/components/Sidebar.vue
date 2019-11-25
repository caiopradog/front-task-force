<template>
  <div class="sidebar">
    <ul class="menu">
      <li class="menu-item" v-on:click="goToPage('projects')" :class="{'active': currentRoute.name.includes('project')}">
        <span class="menu-name">
          Projetos
        </span>
        <span class="menu-icon">
          <fa icon="list"></fa>
        </span>
      </li>
      <li class="menu-item" v-on:click="goToPage('epics')" :class="{'active': currentRoute.name.includes('epic')}">
        <span class="menu-name">
          Épicos
        </span>
        <span class="menu-icon">
          <fa icon="box"></fa>
        </span>
      </li>
      <li class="menu-item" v-on:click="goToPage('sprints')" :class="{'active': currentRoute.name.includes('sprint')}">
        <span class="menu-name">
          Sprints
        </span>
        <span class="menu-icon">
          <fa icon="flag"></fa>
        </span>
      </li>
      <li class="menu-item" v-on:click="goToPage('tasks')" :class="{'active': currentRoute.name.includes('task')}">
        <span class="menu-name">
          Tarefas
        </span>
        <span class="menu-icon">
          <fa icon="clipboard-check"></fa>
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
      <li class="menu-item" v-on:click="goToPage('rewards')" :class="{'active': currentRoute.name.includes('reward')}">
        <span class="menu-name">
          Recompensas
        </span>
        <span class="menu-icon">
          <fa icon="store"></fa>
        </span>
      </li>
<!--      <li class="menu-item" v-on:click="goToPage('users')" :class="{'active': currentRoute.name.includes('user')}">-->
<!--        <span class="menu-name">-->
<!--          Usuários-->
<!--        </span>-->
<!--        <span class="menu-icon">-->
<!--          <fa icon="users"></fa>-->
<!--        </span>-->
<!--      </li>-->
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
                this.$router.replace({'name': page});
            }
        }
    }
</script>
