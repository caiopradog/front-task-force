<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            {{ $route.meta.title }}
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-3">
                <div class="form-group" :class="{'error': error.name}">
                  <label>Nome</label>
                  <input type="text" class="form-control" placeholder="Nome" v-model="user.name">
                  <template v-if="error.name">
                    <small class="form-text text-danger" v-for="msg in error.name" :key="'name-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.email}">
                  <label>Email</label>
                  <input type="email" disabled class="form-control" placeholder="Email" v-model="user.email">
                  <template v-if="error.email">
                    <small class="form-text text-danger" v-for="msg in error.email" :key="'name-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.status}">
                  <label>Status</label>
                  <select-2 :name="'Status'" :component-class="'form-control'" :options="statusOpts"
                            v-model="user.status" :search="true" :default="user.status"/>
                  <template v-if="error.status">
                    <small class="form-text text-danger" v-for="msg in error.status" :key="'category-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
<!--              <div class="col-3">-->
<!--                <div class="form-group" :class="{'error': error.user_group_id}">-->
<!--                  <label>Empresa</label>-->
<!--                  <select-2 :name="'Empresa'" :component-class="'form-control'" :options="companyOpts"-->
<!--                            v-model="user.company_id" :search="true" :default="user.company_id"/>-->
<!--                  <template v-if="error.company_id">-->
<!--                    <small class="form-text text-danger" v-for="msg in error.company_id" :key="'category-error-'+msg">{{ msg }}</small>-->
<!--                  </template>-->
<!--                </div>-->
<!--              </div>-->
              <div class="col-3">
                <div class="form-group" :class="{'error': error.user_group_id}">
                  <label>Grupo</label>
                  <select-2 :name="'Grupo'" :component-class="'form-control'" :options="groupsOpts"
                            v-model="user.user_group_id" :search="true" :default="user.user_group_id"/>
                  <template v-if="error.user_group_id">
                    <small class="form-text text-danger" v-for="msg in error.user_group_id" :key="'category-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <template v-if="$store.state.user.user_group_id == 1">
                <div class="col-12">
                  <hr>
                </div>
                <div class="col-12 mb-2">
                  <h5>Habilidades</h5>
                </div>
                <div class="col-3" v-for="skill in skills" :key="skill">
                  <div class="form-group" :class="{'error': error.name}">
                    <label>{{ skill }}</label>
                    <input type="number" class="form-control" :placeholder="skill" v-model="user.skills[skill]">
                  </div>
                </div>
              </template>
              <div class="col-12">
                <hr>
              </div>
              <div class="col-12 mt-3">
                <button class="btn btn-primary mr-2" v-on:click="saveUser" v-bind:disabled="request" type="button">Salvar</button>
                <button class="btn btn-light mr-2" v-on:click="goBack" type="button">Voltar</button>
                <button class="btn btn-outline-danger mr-2" v-on:click="logout" type="button">Logout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import Select2 from '../components/Select2';

    export default {
        name: 'User',
        data: function () {
            return {
                user: {
                    name: '',
                    status: '',
                    user_group_id: '',
                    email: '',
                    current_score: '',
                    total_score: '',
                    skills: {},
                    // company_id: '',
                },
                error: {},
                groupsOpts: [],
                statusOpts: [],
                skills: [],
                // companyOpts: [],
                request: false,
                id: this.$route.params.id || false,
            }
        },
        methods: {
            saveUser: function () {
                this.request = true;

                let url = '/user';
                if (this.id) {
                    url += '/'+this.id;
                }

                this.$http({
                    url: url,
                    method: 'put',
                    data: this.user
                }).then(response => {
                    this.error = {};
                    this.$notify({
                        text: response.data.msg,
                        type: 'success'
                    });
                    this.id = response.data.user.id;
                    this.$route.meta.title = 'Editar Tarefa';
                }).catch(error => {
                    this.error = error.response.data.errors;
                }).finally(() => {
                    this.request = false;
                });
            },
            getUserStatuses: function () {
                return this.$http({
                    url: '/user_statuses'
                });
            },
            getSkills: function () {
                return this.$http({
                    url: '/task_categories'
                });
            },
            getGroups: function () {
                return this.$http({
                    url: '/user_groups',
                    params: {
                        status: "Ativo"
                    }
                });
            },
            getCurrentUser: function () {
                return this.$http({
                    url: '/user/'+this.id
                }).then(response => {
                    response.data.skills = this.user.skills;
                    this.user = response.data;
                    this.getCurrentUserSkills()
                })
            },
            getCurrentUserSkills: function () {
                return this.$http({
                    url: '/user_skills/'+this.id
                }).then(response => {
                    for (let skill of this.skills) {
                        this.user.skills[skill] = response.data[skill] || 0;
                    }

                    this.$store.state.loading = false
                })
            },
            fetchAllData: function () {
                this.$store.state.loading = true;
                this.getUserStatuses().then(response => {
                    this.statusOpts = response.data;
                    return this.getGroups()
                }).then(response => {
                    for (let data of response.data) {
                        this.groupsOpts.push({name: data.name, value: data.id});
                    }

                    return this.getSkills()
                }).then(response => {
                    let skills = {};
                    for (let skill of response.data) {
                        let name = skill.name;
                        skills[name] = 0;
                    }
                    this.user.skills = skills;
                    this.skills = response.data.map(skill => skill.name);

                    if (this.id) {
                        this.getCurrentUser()
                    } else {
                        this.$store.state.loading = false;
                    }
                }).catch(() => this.logout());
            },
            goBack: function () {
                this.$store.state.loading = true;
                this.$router.back();
            },
            logout: function () {
                this.$store.state.user = false;
                this.$router.go(-100);
                this.$router.replace('/');
            },
            secToTime: function (seconds) {
                const h = Math.floor(seconds / 3600);
                const m = Math.floor((seconds % 3600) / 60);
                return [
                    h,
                    m > 9 ? m : (h ? '0' + m : m || '0'),
                ].filter(a => a).join(':');
            }
        },
        mounted() {
            this.fetchAllData();
            if (this.id) {
                this.$route.meta.title = 'Editar Usuário';
            } else {
                this.$route.meta.title = 'Criar Usuário';
            }
        },
        components: {
            'select-2': Select2,
        }
    }
</script>
