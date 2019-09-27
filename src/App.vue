<template>
  <div id="app">
    <notifications/>
    <div class="loading" v-if="pageLoading">
      <div class="icon">
        <fa icon="spinner" pulse size="6x"></fa>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
    export default {
        name: 'App',
        computed: {
            pageLoading: function() {
                return this.$store.state.loading;
            }
        }
    }
</script>