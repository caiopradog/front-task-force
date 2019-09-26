<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            Tarefa
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-3">
                <div class="form-group">
                  <label>Nome</label>
                  <input type="text" class="form-control" placeholder="Nome" v-model="task.name">
                  <small class="form-text text-danger" v-if="error.name">{{ error.name }}</small>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label>Status</label>
                  <select-2 v-bind:name="'Status'" v-bind:component-class="'form-control'" v-bind:options="statusOpts"
                            v-model="task.status" v-bind:search="true" v-bind:default="task.status"/>
                  <small class="form-text text-danger" v-if="error.status">{{ error.status }}</small>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label>Categoria</label>
                  <select-2 v-bind:name="'Categoria'" v-bind:component-class="'form-control'" v-bind:options="categoriesOpts"
                            v-model="task.category" v-bind:search="true" v-bind:default="task.category"/>
                  <small class="form-text text-danger" v-if="error.category">{{ error.category }}</small>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label>Data de Entrega</label>
                  <datepicker v-bind:input-class="'form-control'" v-model="task.deadline" v-bind:language="ptBR"
                              v-bind:aria-placeholder="'Data de Entrega'" v-bind:full-month-name="true" v-bind:format="'dd/MM/yyyy'"/>
                  <small class="form-text text-danger" v-if="error.deadline">{{ error.deadline }}</small>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label>Projeto</label>
                  <select-2 v-bind:name="'Projeto'" v-bind:component-class="'form-control'" v-bind:options="projectsOpts"
                            v-model="task.project_id" v-bind:search="true" v-bind:default="task.project_id"/>
                  <small class="form-text text-danger" v-if="error.project_id">{{ error.project_id }}</small>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label>Épico</label>
                  <select-2 v-bind:name="'Épico'" v-bind:component-class="'form-control'" v-bind:options="epicsOpts"
                            v-model="task.epic_id" v-bind:search="true" v-bind:default="task.epic_id"/>
                  <small class="form-text text-danger" v-if="error.epic_id">{{ error.epic_id }}</small>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label>Sprint</label>
                  <select-2 v-bind:name="'Sprint'" v-bind:component-class="'form-control'" v-bind:options="sprintsOpts"
                            v-model="task.sprint_id" v-bind:search="true" v-bind:default="task.sprint_id"/>
                  <small class="form-text text-danger" v-if="error.sprint_id">{{ error.sprint_id }}</small>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label>Prioridade</label>
                  <input type="number" class="form-control" placeholder="Prioridade" v-model="task.priority">
                  <small class="form-text text-danger" v-if="error.priority">{{ error.priority }}</small>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label>Horas Previstas</label>
                  <the-mask v-bind:mask="['#:##', '##:##']" class="form-control" placeholder="Horas Previstas" v-model="task.time_planned"/>
                  <small class="form-text text-danger" v-if="error.time_planned">{{ error.time_planned }}</small>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label>Horas Realizadas</label>
                  <the-mask v-bind:mask="['#:##', '##:##']" class="form-control" placeholder="Horas Previstas" v-model="task.time_used"/>
                  <small class="form-text text-danger" v-if="error.time_used">{{ error.time_used }}</small>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label>Responsável Desenvolvimento</label>
                  <select-2 v-bind:name="'Responsável Desenvolvimento'" v-bind:component-class="'form-control'" v-bind:options="usersOpts"
                            v-model="task.dev_user_id" v-bind:search="true" v-bind:default="task.dev_user_id"/>
                  <small class="form-text text-danger" v-if="error.dev_user_id">{{ error.dev_user_id }}</small>
                </div>
              </div>
              <div class="col-3">
                <div class="form-group">
                  <label>Responsável Qualidade</label>
                  <select-2 v-bind:name="'Responsável Qualidade'" v-bind:component-class="'form-control'" v-bind:options="usersOpts"
                            v-model="task.qa_user_id" v-bind:search="true" v-bind:default="task.qa_user_id"/>
                  <small class="form-text text-danger" v-if="error.qa_user_id">{{ error.qa_user_id }}</small>
                </div>
              </div>
              <div class="col-12">
                <hr>
                <label>Descrição</label>
                <textarea v-model="task.description" class="form-control" style="height: 200px;"></textarea>
              </div>
              <div class="col-12 mt-3">
                <button class="btn btn-primary mr-2" type="button">Salvar</button>
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
    import Datepicker from 'vuejs-datepicker';
    import {ptBR} from 'vuejs-datepicker/dist/locale'
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
                error: {
                    name: '',
                    status: '',
                    category: '',
                    project_id: '',
                    sprint_id: '',
                    epic_id: '',
                    qa_user_id: '',
                    dev_user_id: '',
                    description: '',
                    time_planned: '',
                    time_used: '',
                    deadline: '',
                    priority: '',
                },
                usersOpts: [],
                epicsOpts: [],
                statusOpts: [],
                sprintsOpts: [],
                projectsOpts: [],
                categoriesOpts: [],
                ptBR: ptBR,
            }
        },
        methods: {
            goBack: function () {
                this.$store.state.loading = true;
                this.$router.back();
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
            getEpics: function () {
                return this.$http({
                    url: '/epics',
                    params: {status: "Ativo"}
                });
            },
            getSprints: function () {
                return this.$http({
                    url: '/sprints',
                    params: {status: "Ativo"}
                });
            },
            getCurrentTask: function () {
                let id = this.$route.params.id;
                return this.$http({
                    url: '/task/'+id
                }).then(response => {
                    let taskInfo = response.data;
                    taskInfo.time_planned = this.secToTime(taskInfo.time_planned);
                    taskInfo.time_used = this.secToTime(taskInfo.time_used);
                    this.task = taskInfo;
                    this.$store.state.loading = false;
                })
            },
            fetchAllData: function () {
                this.getUsers().then(response => {
                    for (let data of response.data) {
                        this.usersOpts.push({name: data.name, value: data.id});
                    }
                    return this.getTasksStatuses()
                }).then(response => {
                    this.statusOpts = response.data
                    return this.getTasksCategories()
                }).then(response => {
                    this.categoriesOpts = response.data
                    return this.getProjects()
                }).then(response => {
                    for (let data of response.data) {
                        this.projectsOpts.push({name: data.name, value: data.id});
                    }
                    return this.getEpics()
                }).then(response => {
                    for (let data of response.data) {
                        this.epicsOpts.push({name: data.name, value: data.id});
                    }
                    return this.getSprints()
                }).then(response => {
                    for (let data of response.data) {
                        this.sprintsOpts.push({name: data.name, value: data.id});
                    }

                    if (this.$route.params.id) {
                        this.getCurrentTask();
                    } else {
                        this.$store.state.loading = false;
                    }
                });
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
        },
        components: {
            'select-2': Select2,
            'datepicker': Datepicker
        }
    }
</script>
