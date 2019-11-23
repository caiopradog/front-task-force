<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            {{ id ? 'Editar' : 'Criar' }} Sprint
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-3">
                <div class="form-group" :class="{'error': error.name}">
                  <label>Nome</label>
                  <input type="text" class="form-control" placeholder="Nome" v-model="formData.name">
                  <template v-if="error.name">
                    <small class="form-text text-danger" v-for="msg in error.name" :key="'name-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.status}">
                  <label>Status</label>
                  <select-2 :name="'Status'" :component-class="'form-control'" :options="statusOpts"
                            v-model="formData.status" :search="true" :default="formData.status"/>
                  <template v-if="error.status">
                    <small class="form-text text-danger" v-for="msg in error.status" :key="'status-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.project_id}">
                  <label>Projeto</label>
                  <select-2 :name="'Projeto'" :component-class="'form-control'" :options="projectsOpts"
                            v-model="formData.project_id" :search="true" :default="formData.project_id"/>
                  <template v-if="error.project_id">
                    <small class="form-text text-danger" v-for="msg in error.project_id" :key="'project_id-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.end_date}">
                  <label>Data de Início</label>
                  <v-date-picker v-model="formData.start_date" locale="pt-PT" :format="'dd/MM/yyyy'"
                                 :input-props="{
                                    placeholder: 'Data de Entrega',
                                    class: 'form-control'
                                 }"></v-date-picker>
                  <template v-if="error.start_date">
                    <small class="form-text text-danger" v-for="msg in error.start_date" :key="'deadline-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.end_date}">
                  <label>Data Final</label>
                  <v-date-picker v-model="formData.end_date" locale="pt-PT" :format="'dd/MM/yyyy'"
                                 :input-props="{
                                    placeholder: 'Data Final',
                                    class: 'form-control'
                                 }"></v-date-picker>
                  <template v-if="error.end_date">
                    <small class="form-text text-danger" v-for="msg in error.end_date" :key="'deadline-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-12">
                <hr>
                <label>Descrição</label>
                <textarea v-model="formData.description" class="form-control" style="height: 200px;"></textarea>
              </div>
              <div class="col-12 mt-3">
                <button class="btn btn-primary mr-2" v-on:click="saveForm" v-bind:disabled="request" type="button">Salvar</button>
                <button class="btn btn-light mr-2" v-on:click="goBack" type="button">Voltar</button>
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
        name: 'Task',
        data: function () {
            return {
                formData: {
                    name: '',
                    status: '',
                    project_id: 0,
                    description: '',
                    start_date: '',
                    end_date: '',
                },
                error: {},
                statusOpts: [],
                projectsOpts: [],
                request: false,
                id: this.$route.params.id || false,
            }
        },
        methods: {
            saveForm: function () {
                this.request = true;

                let url = '/sprint';
                if (this.id) {
                    url += '/'+this.id;
                }

                this.$http({
                    url: url,
                    method: 'put',
                    data: this.formData
                }).then(response => {
                    this.error = {};
                    this.$notify({
                        text: response.data.msg,
                        type: 'success'
                    });
                    this.id = response.data.sprint.id;
                    this.$route.meta.title = 'Editar Sprint';
                }).catch(error => {
                      this.error = error.response.data.errors;
                }).finally(() => {
                    this.request = false;
                });
            },
            getStatuses: function () {
                return this.$http({
                    url: '/default_statuses'
                });
            },
            getProjects: function () {
                return this.$http({
                    url: '/projects',
                    params: {status: "Ativo"}
                });
            },
            getCurrentSprint: function () {
                return this.$http({
                    url: '/sprint/'+this.id
                })
            },
            fetchAllData: function () {
                this.$store.state.loading = true;
                this.getStatuses().then(response => {
                    this.statusOpts = response.data;
                    return this.getProjects()
                }).then(response => {
                    for (let data of response.data) {
                        this.projectsOpts.push({name: data.name, value: data.id});
                    }

                    return this.getCurrentSprint()
                }).then(response => {
                    let formData = response.data;
                    formData.start_date = new Date(formData.start_date);
                    formData.end_date = new Date(formData.end_date);

                    this.formData = formData;
                    this.$store.state.loading = false;
                }).catch(() => {
                    this.$store.state.user = false;
                    this.$router.go(-100);
                    this.$router.replace('/');
                });
            },
            goBack: function () {
                this.$store.state.loading = true;
                this.$router.back();
            }
        },
        mounted() {
            this.fetchAllData();
            if (this.id) {
                this.$route.meta.title = 'Editar Sprint';
            } else {
                this.$route.meta.title = 'Criar Sprint';
            }
        },
        components: {
            'select-2': Select2,
        }
    }
</script>
