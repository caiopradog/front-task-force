<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            {{ id ? 'Editar' : 'Criar' }} Tarefa
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-3">
                <div class="form-group" :class="{'error': error.name}">
                  <label>Nome</label>
                  <input type="text" class="form-control" placeholder="Nome" v-model="task.name">
                  <template v-if="error.name">
                    <small class="form-text text-danger" v-for="msg in error.name" :key="'name-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.status}">
                  <label>Status</label>
                  <select-2 :name="'Status'" :component-class="'form-control'" :options="statusOpts"
                            v-model="task.status" :search="true" :default="task.status"/>
                  <template v-if="error.status">
                    <small class="form-text text-danger" v-for="msg in error.status" :key="'status-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.category}">
                  <label>Categoria</label>
                  <select-2 :name="'Categoria'" :component-class="'form-control'" :options="categoriesOpts"
                            v-model="task.category" :search="true" :default="task.category"/>
                  <template v-if="error.category">
                    <small class="form-text text-danger" v-for="msg in error.category" :key="'category-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.deadline}">
                  <label>Data de Entrega</label>
                  <v-date-picker v-model="task.deadline" locale="pt-PT" :format="'dd/MM/yyyy'"
                                 :input-props="{
                                    placeholder: 'Data de Entrega',
                                    class: 'form-control'
                                 }"></v-date-picker>
                  <template v-if="error.deadline">
                    <small class="form-text text-danger" v-for="msg in error.deadline" :key="'deadline-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.project_id}">
                  <label>Projeto</label>
                  <select-2 :name="'Projeto'" :component-class="'form-control'" :options="projectsOpts"
                            v-model="task.project_id" :search="true" :default="task.project_id"/>
                  <template v-if="error.project_id">
                    <small class="form-text text-danger" v-for="msg in error.project_id" :key="'project_id-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.epic_id}">
                  <label>Épico</label>
                  <select-2 :name="'Épico'" :component-class="'form-control'" :options="epicsOpts"
                            v-model="task.epic_id" :search="true" :default="task.epic_id"/>
                  <template v-if="error.epic_id">
                    <small class="form-text text-danger" v-for="msg in error.epic_id" :key="'epic_id-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.sprint_id}">
                  <label>Sprint</label>
                  <select-2 v-model="task.sprint_id" :name="'Sprint'" :component-class="'form-control'"
                            :options="sprintsOpts" :search="true" :default="task.sprint_id"/>
                  <template v-if="error.sprint_id">
                    <small class="form-text text-danger" v-for="msg in error.sprint_id" :key="'sprint_id-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.priority}">
                  <label>Prioridade</label>
                  <input type="number" class="form-control" placeholder="Prioridade" v-model="task.priority">
                  <template v-if="error.priority">
                    <small class="form-text text-danger" v-for="msg in error.priority" :key="'priority-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.time_planned}">
                  <label>Horas Previstas</label>
                  <the-mask :mask="['#:##', '##:##']" :masked="true" class="form-control" placeholder="Horas Previstas" v-model="task.time_planned"/>
                  <template v-if="error.time_planned">
                    <small class="form-text text-danger" v-for="msg in error.time_planned" :key="'time_planned-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.time_used}">
                  <label>Horas Realizadas</label>
                  <the-mask :mask="['#:##', '##:##']" :masked="true" class="form-control" placeholder="Horas Previstas" v-model="task.time_used"/>
                  <template v-if="error.time_used">
                    <small class="form-text text-danger" v-for="msg in error.time_used" :key="'time_used-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.dev_user_id}">
                  <label>Responsável Desenvolvimento</label>
                  <select-2 :name="'Responsável Desenvolvimento'" :component-class="'form-control'" :options="usersOpts"
                            v-model="task.dev_user_id" :search="true" :default="task.dev_user_id"/>
                  <template v-if="error.dev_user_id">
                    <small class="form-text text-danger" v-for="msg in error.dev_user_id" :key="'dev_user_id-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group" :class="{'error': error.qa_user_id}">
                  <label>Responsável Qualidade</label>
                  <select-2 :name="'Responsável Qualidade'" :component-class="'form-control'" :options="usersOpts"
                            v-model="task.qa_user_id" :search="true" :default="task.qa_user_id"/>
                  <template v-if="error.qa_user_id">
                    <small class="form-text text-danger" v-for="msg in error.qa_user_id" :key="'qa_user_id-error-'+msg">{{ msg }}</small>
                  </template>
                </div>
              </div>
              <div class="col-12">
                <hr>
                <label>Descrição</label>
                <textarea v-model="task.description" class="form-control" style="height: 200px;"></textarea>
              </div>
              <div class="col-12 mt-3">
                <button class="btn btn-primary mr-2" v-on:click="saveTask" v-bind:disabled="request" type="button">Salvar</button>
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
                task: {
                    name: '',
                    status: '',
                    category: '',
                    deadline: '',
                    project_id: 0,
                    sprint_id: 0,
                    epic_id: 0,
                    time_planned: '',
                    time_used: '',
                    priority: 0,
                    qa_user_id: 0,
                    dev_user_id: 0,
                    description: '',
                },
                error: {},
                usersOpts: [],
                epicsOpts: [],
                statusOpts: [],
                sprintsOpts: [],
                projectsOpts: [],
                categoriesOpts: [],
                request: false,
                id: this.$route.params.id || false,
            }
        },
        methods: {
            saveTask: function () {
                this.request = true;

                let url = '/task';
                if (this.id) {
                    url += '/'+this.id;
                }

                this.$http({
                    url: url,
                    method: 'put',
                    data: this.task
                }).then(response => {
                    this.error = {};
                    this.$notify({
                        text: response.data.msg,
                        type: 'success'
                    });
                    this.id = response.data.task.id;
                }).catch(error => {
                      this.error = error.response.data.errors;
                }).finally(() => {
                    this.request = false;
                });
            },
            getUsers: function () {
                return this.$http({
                    url: '/users'
                });
            },
            getTasksStatuses: function () {
                return this.$http({
                    url: '/task_statuses'
                });
            },
            getTasksCategories: function () {
                return this.$http({
                    url: '/task_categories'
                });
            },
            getProjects: function () {
                return this.$http({
                    url: '/projects',
                    params: {status: "Ativo"}
                });
            },
            getEpics: function (project_id) {
                return this.$http({
                    url: '/epics',
                    params: {
                        status: "Ativo",
                        project_id: project_id
                    }
                });
            },
            getSprints: function (project_id) {
                return this.$http({
                    url: '/sprints',
                    params: {
                        status: "Ativo",
                        project_id: project_id
                    }
                });
            },
            getCurrentTask: function () {
                return this.$http({
                    url: '/task/'+this.id
                })
            },
            fetchAllData: function () {
                this.$store.state.loading = true;
                this.getUsers().then(response => {
                    for (let data of response.data) {
                        this.usersOpts.push({name: data.name, value: data.id});
                    }
                    return this.getTasksStatuses()
                }).then(response => {
                    this.statusOpts = response.data;
                    return this.getTasksCategories()
                }).then(response => {
                    this.categoriesOpts = response.data;
                    return this.getProjects()
                }).then(response => {
                    for (let data of response.data) {
                        this.projectsOpts.push({name: data.name, value: data.id});
                    }

                    if (this.id) {
                        this.fetchExistingTaskData();
                    } else {
                        this.$store.state.loading = false;
                    }
                });
            },
            fetchExistingTaskData: function () {
                this.getCurrentTask().then(response => {
                    let taskInfo = response.data;
                    taskInfo.time_planned = this.secToTime(taskInfo.time_planned);
                    taskInfo.time_used = this.secToTime(taskInfo.time_used);
                    taskInfo.deadline = new Date(taskInfo.deadline+" 00:00:00");

                    this.fetchEpicAndSprint(taskInfo.project_id).finally(() => {
                        this.task = taskInfo;
                        this.$store.state.loading = false;
                    })
                })
            },
            fetchEpicAndSprint: function (project_id) {
                return this.getEpics(project_id).then(response => {
                    this.epicsOpts = [];
                    for (let data of response.data) {
                        this.epicsOpts.push({name: data.name, value: data.id});
                    }
                    return this.getSprints(project_id)
                }).then(response => {
                    this.sprintsOpts = [];
                    for (let data of response.data) {
                        this.sprintsOpts.push({name: data.name, value: data.id});
                    }
                })
            },
            goBack: function () {
                this.$store.state.loading = true;
                this.$router.back();
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
        watch: {
            'task.project_id': function (project_id) {
                this.fetchEpicAndSprint(project_id)
            }
        },
        mounted() {
            this.fetchAllData();
        },
        components: {
            'select-2': Select2,
        }
    }
</script>
