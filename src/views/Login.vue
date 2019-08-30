<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-6 offset-3">
        <div class="card">
          <div class="card-header">
            Teste Login
          </div>
          <div class="card-body">
            <form v-on:submit.prevent="getUser" class="mb-2">
              <input class="form-control mb-2" type="text" placeholder="E-mail" v-model="username">
              <input class="form-control mb-2" type="password" placeholder="Senha" v-model="password">
              <button class="btn btn-primary btn-block" v-bind:disabled="username === '' || password === '' || requesting">Login</button>
            </form>
            <div class="text-danger text-center" v-if="errorTxt !== ''">{{ errorTxt }}</div>
            <div v-if="userData">
              Usuário: {{ userData.name }} <br>
              E-mail: {{ userData.email }} <br>
              <button type="button" class="btn btn-success btn-block my-2"
                      v-on:click="getGroup"
                      v-bind:disabled="groupRequesting">Verificar Grupo do Usuário</button>
            </div>
            <div v-if="groupData">
              Nome do Grupo: {{ groupData.name }} <br>
            </div>
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
                    localStorage.api_token = response.data.api_token;
                    this.$store.state.api_token = response.data.api_token;
                })
                    .catch(error => this.errorTxt = error.response.data.msg)
                    .finally(() => this.requesting = false)
            },
            getGroup: function() {
                this.groupRequesting = true;
                this.groupData = false;
                this.$http({
                    method: 'get',
                    url: '/user_group',
                }).then(response => {
                    this.groupData = response.data;
                })
                    .finally(() => this.groupRequesting = false)
            }
        }
    }
</script>