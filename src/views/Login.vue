<template>
  <div class="container">
    <div class="row">
      <div class="col-6 offset-3">
        <div class="card">
          <div class="card-header">
            Login
          </div>
          <div class="card-body">
            <form v-on:submit.prevent="getUser" class="mb-2">
              <input class="form-control mb-2" type="text" placeholder="E-mail" v-model="username">
              <input class="form-control mb-2" type="password" placeholder="Senha" v-model="password">
              <button class="btn btn-primary btn-block" :disabled="username === '' || password === '' || requesting">Login</button>
            </form>
            <div class="text-danger text-center" v-if="errorTxt !== ''">{{ errorTxt }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: 'Login',
        data: function () {
            return {
                username: '',
                password: '',
                errorTxt: '',
                userData: false,
                groupData: false,
                requesting: false,
                groupRequesting: false
            }
        },
        methods: {
            getUser: function() {
                this.requesting = true;
                this.userData = false;

                this.$http({
                    method: 'post',
                    url: '/login',
                    data: {
                        email: this.username,
                        password: this.password
                    },

                }).then(response => {
                    this.userData = response.data;
                    localStorage.user = JSON.stringify(response.data);
                    this.$store.state.user = response.data;
                    this.$http.defaults.headers['Authorization'] = 'Bearer ' + response.data.api_token;

                    this.$router.push('tasks');
                })
                    .catch(error => this.errorTxt = error.response.data.msg)
                    .finally(() => this.requesting = false)
            },
        },
        mounted: function () {
            this.$store.state.loading = false;
            if (this.$store.state.user) {
                this.$router.push('/tasks');
            }
        }
    }
</script>