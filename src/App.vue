<template>
  <div id="app">
    <notifications/>
    <div class="loading" v-if="pageLoading">
      <div class="icon">
        <fa icon="spinner" pulse size="6x"></fa>
      </div>
    </div>
    <div class="content">
      <topmenu v-if="user"></topmenu>
      <div class="page-container">
        <sidebar v-if="user"></sidebar>
        <div class="page-content">
          <transition name="fade" mode="out-in">
            <router-view class="page"/>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import Sidebar from './components/Sidebar'
    import Header from './components/Header'

    export default {
        name: 'App',
        computed: {
            pageLoading: function() {
                return this.$store.state.loading;
            },
            user: function () {
                return this.$store.state.user;
            }
        },
        components: {
            'sidebar': Sidebar,
            'topmenu': Header,
        }
    }
</script>