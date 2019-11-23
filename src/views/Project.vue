<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            {{ id ? 'Editar' : 'Criar' }} Projeto
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
                <div class="form-group" :class="{'error': error.deadline}">
                  <label>Data de Entrega</label>
                  <v-date-picker v-model="formData.deadline" locale="pt-PT" :format="'dd/MM/yyyy'"
                                 :input-props="{
                                    placeholder: 'Data de Entrega',
                                    class: 'form-control'
                                 }"></v-date-picker>
                  <template v-if="error.deadline">
                    <small class="form-text text-danger" v-for="msg in error.deadline" :key="'deadline-error-'+msg">{{ msg }}</small>
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
                    deadline: '',
                    description: '',
                },
                error: {},
                statusOpts: [],
                request: false,
                id: this.$route.params.id || false,
            }
        },
        methods: {
            saveForm: function () {
                this.request = true;

                let url = '/project';
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
                    this.id = response.data.project.id;
                    this.$route.meta.title = 'Editar Projeto';
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
            getCurrentProject: function () {
                return this.$http({
                    url: '/project/'+this.id
                })
            },
            fetchAllData: function () {
                this.$store.state.loading = true;
                this.getStatuses().then(response => {
                    this.statusOpts = response.data;
                    return this.getCurrentProject()
                }).then(response => {
                    let formData = response.data;
                    formData.deadline = new Date(formData.deadline);

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
                this.$route.meta.title = 'Editar Projeto';
            } else {
                this.$route.meta.title = 'Criar Projeto';
            }
        },
        components: {
            'select-2': Select2,
        }
    }
</script>
