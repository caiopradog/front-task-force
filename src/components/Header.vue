<template>
  <div class="header">
    <div class="row">
      <div class="col-12 text-right">
        <div class="user-name" v-on:click="goToUser(user.id)">{{ user.name }}</div>
        <img class="user-icon" v-on:click="goToUser(user.id)" src="user.png">
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'Header',
        computed: {
            user: function() {
                return this.$store.state.user;
            },
            currentRoute: function () {
                return this.$route;
            }
        },
        methods: {
            goToUser: function (id) {
                if (this.currentRoute.path !== '/user/'+id) {
                    this.$store.state.loading = true;
                    this.$router.push({name: 'user', params: {id: id}})
                }
            }
        }
    }
</script>
