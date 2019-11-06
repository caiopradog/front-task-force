<template>
  <div class="task-view">
    <div class="row">
      <div class="col-9">
        <div class="card">
          <div class="card-header">
             {{ task.project.name }}
          </div>
          <div class="card-body">
            <input class="task-input title" v-model="task.name">
            <textarea class="task-input desc" v-model="task.description"></textarea>
          </div>
        </div>
      </div>
      <div class="col-3">
        <div class="card">
          <div class="card-header">
            <div class="btn-group btn-group-sm">
              <button class="btn" :class="'btn-outline-'+task.status_color">{{ task.status }}</button>
              <button class="btn" :class="'btn-outline-'+task.status_color">
                <fa icon="caret-right"></fa>
              </button>
            </div>
            <button class="ml-3 btn btn-sm btn-outline-success">
              <fa icon="check"></fa>
            </button>
          </div>
          <div class="card-body">
            <div class="row mb-2">
              <div class="col-6">
                Início:
              </div>
              <div class="col-6">
                {{ task.start_date | date }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-6">
                Entrega:
              </div>
              <div class="col-6">
                {{ task.deadline | date }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-6">
                Horas previstas:
              </div>
              <div class="col-6">
                {{ task.time_planned | secToHourMin }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-6">
                Horas utilizadas:
              </div>
              <div class="col-6">
                {{ task.time_used | secToHourMin }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-6">
                Responsável:
              </div>
              <div class="col-6">
                {{ task.dev_user.name }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-6">
                Categoria:
              </div>
              <div class="col-6">
                {{ task.category }}
              </div>
            </div>
            <div class="row mb-2">
              <div class="col-6">
                Prioridade:
              </div>
              <div class="col-6">
                {{ task.priority }}
              </div>
            </div>
            <div class="row my-2">
              <div class="col-12">
                <hr>
              </div>
            </div>
            <div class="row">
              <div class="col-6 offset-3">
                <button class="btn btn-block btn-outline-light" v-on:click="goBack()">Voltar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row mt-4">
      <div class="col-12">
        <div class="task-log">
          <div class="log">
            <div class="text">{{ createdTaskText }}</div>
            <div class="info">{{ task.created_at | datetime }}</div>
          </div>
          <div class="log" v-for="log in taskLogs">
            <div class="text">{{ log.text }}</div>
            <div class="info">{{ log.user }} - {{ log.created | datetime }}</div>
          </div>
        </div>
        <form class="log-input" v-on:submit.prevent="addToLogs()">
          <input type="text" v-model="taskLog.text" placeholder="Crie uma nova interação">
          <button type="button" class="btn btn-outline-light border-0">
            <fa icon="stopwatch"></fa>
          </button>
          <button class="btn btn-outline-light border-0">
            <fa icon="paper-plane"></fa>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
    import Select2 from '../components/Select2';
    export default {
        name: 'ViewTask',
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
                taskLog: {
                    text: '',
                    time: ''
                },
                taskLogs: [{
                    text: 'Desenvolvimento da funcionalidade de criação, edição e remoção de tarefas',
                    time: '',
                    user: 'Caio do Prado Gralho',
                    created: '2019-11-15 12:25:13'
                }],
                error: {},
                statusOpts: [],
                request: false,
                id: this.$route.params.id,
            }
        },
        computed: {
            createdTaskText: function () {
                let user = this.task.created_user.name;
                if (this.task.user_created_id == this.$store.state.user.id) {
                    user = "Você";
                }

                return user+" criou a tarefa";
            }
        },
        methods: {
            addToLogs: function () {
                let log = JSON.parse(JSON.stringify(this.taskLog));
                log.created = '2019-01-01 00:13:39';
                log.created = this.$store.state.user.name;
                this.taskLogs.push(log);
                this.taskLog.text = '';
                this.taskLog.time = '';
            },
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
                    this.$route.meta.title = 'Editar Tarefa';
                }).catch(error => {
                      this.error = error.response.data.errors;
                }).finally(() => {
                    this.request = false;
                });
            },
            getTasksStatuses: function () {
                return this.$http({
                    url: '/task_statuses'
                });
            },
            getCurrentTask: function () {
                return this.$http({
                    url: '/task/'+this.id,
                    params: {
                        withRelations: true
                    }
                })
            },
            fetchAllData: function () {
                this.$store.state.loading = true;
                this.getTasksStatuses().then(response => {
                    this.statusOpts = response.data;
                    return this.getCurrentTask()
                }).then(response => {
                    this.task = response.data;
                    this.$store.state.loading = false;
                });
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
        mounted() {
            this.fetchAllData();
        },
        components: {
            'select-2': Select2,
        }
    }
</script>
